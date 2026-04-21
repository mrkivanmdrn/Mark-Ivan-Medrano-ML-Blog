// src/pages/CreatePostPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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

function CreatePostPage() {
  const [form, setForm] = useState({ title: "", body: "", tag: "General" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
      const res = await API.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Failed to create post.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="main-content">
      <section className="content-section">
        <h2 className="section-heading">✏ Write a New Post</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Share your ML strategies, hero guides, or match stories with the
          community.
        </p>

        <form onSubmit={handleSubmit} className="form-wrapper" noValidate>
          {/* Title */}
          <div className="form-field">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. Best Marksman Builds This Season"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
            />
            <span className="error-msg">{errors.title || ""}</span>
          </div>

          {/* Tag */}
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

          {/* Body */}
          <div className="form-field">
            <label htmlFor="body">Post Content</label>
            <textarea
              id="body"
              className="form-input"
              rows="10"
              placeholder="Write your post here. Use line breaks to separate paragraphs."
              value={form.body}
              onChange={(e) => {
                setForm({ ...form, body: e.target.value });
                setErrors({ ...errors, body: "" });
              }}
            />
            <span className="error-msg">{errors.body || ""}</span>
          </div>

          {/* Image */}
          <div className="form-field">
            <label>Cover Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: "0.4rem 0" }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
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
              {saving ? "Publishing…" : "Publish Post"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreatePostPage;
