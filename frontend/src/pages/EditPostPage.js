// src/pages/EditPostPage.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const TAGS = [
  "General",
  "Strategy",
  "Hero Guide",
  "Tier List",
  "Beginner Guide",
  "Advanced",
  "Opinion",
  "Tournament",
  "Community",
];
const API_URL = "http://localhost:5000";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ title: "", body: "", tag: "General" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existing, setExisting] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        const p = res.data;
        // Redirect if not owner or admin
        if (p.author._id !== user?._id && user?.role !== "admin") {
          navigate("/home");
          return;
        }
        setForm({ title: p.title, body: p.body, tag: p.tag || "General" });
        setExisting(p.image || "");
      })
      .catch(() => navigate("/home"))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setImage(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    else if (form.title.length < 5)
      e.title = "Title must be at least 5 characters.";
    if (!form.body.trim()) e.body = "Post body is required.";
    else if (form.body.length < 20)
      e.body = "Post must be at least 20 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("body", form.body);
      data.append("tag", form.tag);
      if (image) data.append("image", image);
      await API.put(`/posts/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Failed to update post.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main className="main-content">
        <p className="loading-msg">Loading post…</p>
      </main>
    );

  return (
    <main className="main-content">
      <section className="content-section">
        <h2 className="section-heading">✏ Edit Post</h2>

        <form onSubmit={handleSubmit} className="form-wrapper" noValidate>
          <div className="form-field">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
            />
            <span className="error-msg">{errors.title || ""}</span>
          </div>

          <div className="form-field">
            <label htmlFor="tag">Category</label>
            <select
              id="tag"
              className="form-input"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="body">Post Content</label>
            <textarea
              id="body"
              className="form-input"
              rows="10"
              value={form.body}
              onChange={(e) => {
                setForm({ ...form, body: e.target.value });
                setErrors({ ...errors, body: "" });
              }}
            />
            <span className="error-msg">{errors.body || ""}</span>
          </div>

          <div className="form-field">
            <label>Cover Image</label>
            {existing && !preview && (
              <div style={{ marginBottom: "0.5rem" }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Current image:
                </p>
                <img
                  src={`${API_URL}/uploads/${existing}`}
                  alt="Current"
                  style={{
                    maxHeight: 180,
                    borderRadius: 8,
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: "0.4rem 0" }}
            />
            {preview && (
              <img
                src={preview}
                alt="New preview"
                style={{
                  marginTop: "0.8rem",
                  maxHeight: 220,
                  borderRadius: 8,
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            )}
          </div>

          {errors.api && <p className="error-msg">{errors.api}</p>}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/posts/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditPostPage;
