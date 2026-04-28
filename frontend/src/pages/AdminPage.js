// src/pages/AdminPage.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Promise.all([API.get("/admin/users"), API.get("/admin/posts")])
      .then(([uRes, pRes]) => {
        setUsers(uRes.data);
        setPosts(pRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const toggleUserStatus = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
      flash(res.data.message);
    } catch (err) {
      flash(err.response?.data?.message || "Error");
    }
  };

  const removePost = async (postId) => {
    if (!window.confirm("Remove this post from public view?")) return;
    try {
      const res = await API.put(`/admin/posts/${postId}/remove`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data.post : p)),
      );
      flash("Post removed successfully.");
    } catch (err) {
      flash(err.response?.data?.message || "Error");
    }
  };

  if (loading)
    return (
      <main className="main-content">
        <p className="loading-msg">Loading admin panel…</p>
      </main>
    );

  const activeUsers = users.filter((u) => u.status === "active").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  return (
    <main className="main-content">
      <section className="content-section">
        <h2 className="section-heading">⭐ Admin Panel</h2>
        {msg && (
          <p
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "0.7rem 1rem",
              borderRadius: 8,
              marginBottom: "1rem",
            }}
          >
            {msg}
          </p>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-num">{users.length}</div>
            <div className="stat-label">Total Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{activeUsers}</div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{publishedPosts}</div>
            <div className="stat-label">Published Posts</div>
          </div>
        </div>

        {/* Tab buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            marginBottom: "1.5rem",
            marginTop: "1rem",
          }}
        >
          <button
            className={tab === "users" ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab("users")}
          >
            👥 Members ({users.length})
          </button>
          <button
            className={tab === "posts" ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab("posts")}
          >
            📝 Posts ({posts.length})
          </button>
        </div>

        {/* Users tab */}
        {tab === "users" && (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                    >
                      No members yet.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {u.profilePic ? (
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${u.profilePic}`}
                            alt={u.name ? `Profile picture of ${u.name}` : 'User avatar'}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {u.name}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.88rem" }}>{u.email}</td>
                    <td style={{ fontSize: "0.88rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 99,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          background:
                            u.status === "active" ? "#dcfce7" : "#fee2e2",
                          color: u.status === "active" ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={
                          u.status === "active" ? "btn-danger" : "btn-primary"
                        }
                        style={{
                          padding: "0.35rem 1rem",
                          fontSize: "0.85rem",
                          marginTop: 0,
                        }}
                        onClick={() => toggleUserStatus(u._id)}
                      >
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Posts tab */}
        {tab === "posts" && (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                    >
                      No posts yet.
                    </td>
                  </tr>
                )}
                {posts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <Link
                        to={`/posts/${p._id}`}
                        style={{ color: "var(--accent)", fontWeight: 600 }}
                      >
                        {p.title.length > 40
                          ? p.title.substring(0, 40) + "…"
                          : p.title}
                      </Link>
                    </td>
                    <td style={{ fontSize: "0.88rem" }}>{p.author?.name}</td>
                    <td style={{ fontSize: "0.88rem" }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 99,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          background:
                            p.status === "published" ? "#dcfce7" : "#fee2e2",
                          color:
                            p.status === "published" ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <Link
                        to={`/posts/${p._id}`}
                        className="btn-secondary"
                        style={{
                          padding: "0.3rem 0.8rem",
                          fontSize: "0.82rem",
                          textDecoration: "none",
                          marginTop: 0,
                        }}
                      >
                        View
                      </Link>
                      {p.status === "published" && (
                        <button
                          className="btn-danger"
                          style={{
                            padding: "0.3rem 0.8rem",
                            fontSize: "0.82rem",
                            marginTop: 0,
                          }}
                          onClick={() => removePost(p._id)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminPage;
