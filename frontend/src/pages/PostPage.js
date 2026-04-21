// src/pages/PostPage.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000";

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get(`/posts/${id}`), API.get(`/comments/${id}`)])
      .then(([postRes, commentRes]) => {
        setPost(postRes.data);
        setComments(commentRes.data);
      })
      .catch(() => navigate("/home"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleComment = async () => {
    if (!body.trim()) return setError("Comment cannot be empty.");
    if (body.trim().length < 3)
      return setError("Comment must be at least 3 characters.");
    try {
      const res = await API.post(`/comments/${id}`, { body });
      setComments((prev) => [...prev, res.data]);
      setBody("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
    }
  };

  if (loading)
    return (
      <main className="main-content">
        <p className="loading-msg">Loading post...</p>
      </main>
    );
  if (!post)
    return (
      <main className="main-content">
        <p>Post not found.</p>
      </main>
    );

  const isOwner = user?._id === post.author?._id;
  const isAdmin = user?.role === "admin";

  return (
    <main className="main-content">
      <div className="post-detail">
        {/* Post header */}
        {post.image && (
          <img
            src={`${API_URL}/uploads/${post.image}`}
            alt={post.title}
            className="post-detail-img"
          />
        )}

        {post.tag && <span className="post-tag">{post.tag}</span>}
        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          {post.author?.profilePic && (
            <img
              src={`${API_URL}/uploads/${post.author.profilePic}`}
              alt=""
              className="author-avatar-lg"
            />
          )}
          <span>
            By <strong>{post.author?.name}</strong>
          </span>
          <span>·</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Post body */}
        <div className="post-detail-body">
          {post.body.split("\n").map((para, i) =>
            para.trim() ? (
              <p key={i} style={{ marginBottom: "1rem" }}>
                {para}
              </p>
            ) : (
              <br key={i} />
            ),
          )}
        </div>

        {/* Owner / admin controls */}
        {(isOwner || isAdmin) && (
          <div className="post-actions">
            {isOwner && (
              <Link to={`/edit-post/${post._id}`} className="btn-primary">
                Edit Post
              </Link>
            )}
            <button className="btn-danger" onClick={handleDeletePost}>
              Delete Post
            </button>
          </div>
        )}

        {/* Comments */}
        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {/* Add comment */}
          {user ? (
            <div className="comment-form">
              <textarea
                rows="3"
                placeholder="Share your thoughts about this post..."
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setError("");
                }}
                className="form-input"
              />
              {error && <span className="error-msg">{error}</span>}
              <button className="btn-primary" onClick={handleComment}>
                Post Comment
              </button>
            </div>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Log in</Link> to leave a comment.
            </p>
          )}

          {/* Comment list */}
          {comments.length === 0 && (
            <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
              No comments yet. Be the first!
            </p>
          )}

          <div className="comment-list">
            {comments.map((c) => {
              const canDelete =
                user?._id === c.author?._id || user?.role === "admin";
              return (
                <div key={c._id} className="comment-item">
                  <div className="comment-header">
                    {c.author?.profilePic && (
                      <img
                        src={`${API_URL}/uploads/${c.author.profilePic}`}
                        alt=""
                        className="author-avatar"
                      />
                    )}
                    <strong>{c.author?.name}</strong>
                    <span className="comment-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {canDelete && (
                      <button
                        className="btn-delete-comment"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="comment-body">{c.body}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PostPage;
