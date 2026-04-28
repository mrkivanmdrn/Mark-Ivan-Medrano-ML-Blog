// src/pages/ProfilePage.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function ProfilePage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("bio", form.bio);
      if (file) data.append("profilePic", file);
      const res = await API.put("/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      setMsg("Profile updated successfully!");
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg("");
    setPwError("");
    if (!pwForm.currentPassword || !pwForm.newPassword)
      return setPwError("All password fields are required.");
    if (pwForm.newPassword.length < 8)
      return setPwError("New password must be at least 8 characters.");
    if (pwForm.newPassword !== pwForm.confirm)
      return setPwError("New passwords do not match.");
    try {
      await API.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    }
  };

  const avatarSrc =
    preview ||
    (user?.profilePic ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.profilePic}` : null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <main className="main-content">
      {/* Profile header */}
      <section className="content-section" style={{ textAlign: "center" }}>
        <div className="profile-avatar-wrap">
          {avatarSrc ? (
            <img src={avatarSrc} alt={user?.name ? `Profile picture of ${user.name}` : 'Profile avatar'} className="profile-avatar-lg" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 style={{ marginTop: "1rem" }}>{user?.name}</h2>
        <span className="post-tag">
          {user?.role === "admin" ? "⭐ Admin" : "⚔ Member"}
        </span>
        {user?.bio && (
          <p style={{ marginTop: "0.8rem", color: "var(--text-secondary)" }}>
            {user.bio}
          </p>
        )}
      </section>

      {/* Edit profile */}
      <section className="content-section">
        <h2 className="section-heading">Edit Profile</h2>
        <div className="form-wrapper">
          <div className="form-field">
            <label>Display Name</label>
            <input
              className="form-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Bio</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Tell the community about yourself..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: "0.4rem 0" }}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {msg && (
            <p style={{ color: "#15803d", marginTop: "0.5rem" }}>{msg}</p>
          )}
          <button
            className="btn-primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </section>

      {/* Change password */}
      <section className="content-section">
        <h2 className="section-heading">Change Password</h2>
        <div className="form-wrapper">
          {[
            {
              id: "currentPassword",
              label: "Current Password",
              ph: "Enter current password",
            },
            {
              id: "newPassword",
              label: "New Password",
              ph: "At least 6 characters",
            },
            {
              id: "confirm",
              label: "Confirm New Password",
              ph: "Re-enter new password",
            },
          ].map(({ id, label, ph }) => (
            <div className="form-field" key={id}>
              <label>{label}</label>
              <input
                className="form-input"
                type="password"
                placeholder={ph}
                value={pwForm[id]}
                onChange={(e) => setPwForm({ ...pwForm, [id]: e.target.value })}
              />
            </div>
          ))}
          {pwError && <p className="error-msg">{pwError}</p>}
          {pwMsg && <p style={{ color: "#15803d" }}>{pwMsg}</p>}
          <button className="btn-primary" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
