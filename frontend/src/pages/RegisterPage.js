// src/pages/RegisterPage.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  else if (form.name.trim().length < 3)
    errors.name = "Name must be at least 3 characters.";
  if (!form.username.trim()) errors.username = "Username is required.";
  else if (form.username.trim().length < 3)
    errors.username = "Username must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
    errors.username = "Only letters, numbers, and underscores.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.dob) errors.dob = "Date of birth is required.";
  else {
    const today = new Date();
    const birth = new Date(form.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (birth > today) errors.dob = "Date cannot be in the future.";
    else if (age < 13) errors.dob = "You must be at least 13 years old.";
  }
  if (!form.level) errors.level = "Please select your interest level.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirm)
    errors.confirm = "Passwords do not match.";
  if (!form.terms) errors.terms = "You must agree to the terms.";
  return errors;
}

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    dob: "",
    level: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [name]: errs[name] || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setApiError("");
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await login(form.email, form.password);
      navigate("/home");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: 560 }}>
          <div className="auth-icon">⚔️</div>
          <h2>Join the Community</h2>
          <p className="auth-sub">Create your ML Portfolio account</p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Name */}
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Mark Ivan Medrano"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.name || ""}</span>
            </div>
            {/* Username */}
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                placeholder="e.g. mark_ivan"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.username || ""}</span>
            </div>
            {/* Email */}
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.email || ""}</span>
            </div>
            {/* DOB */}
            <div className="form-field">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                name="dob"
                type="date"
                className="form-input"
                value={form.dob}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.dob || ""}</span>
            </div>
            {/* Interest level */}
            <div className="form-field">
              <label>Interest Level</label>
              <div className="radio-group">
                {["beginner", "intermediate", "expert"].map((lvl) => (
                  <label
                    key={lvl}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={form.level === lvl}
                      onChange={handleChange}
                    />
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </label>
                ))}
              </div>
              <span className="error-msg">{errors.level || ""}</span>
            </div>
            {/* Password */}
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.password || ""}</span>
            </div>
            {/* Confirm */}
            <div className="form-field">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="error-msg">{errors.confirm || ""}</span>
            </div>
            {/* Terms */}
            <div
              className="form-field"
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={handleChange}
                style={{ width: "auto", marginTop: 0 }}
              />
              <label htmlFor="terms" style={{ marginTop: 0, fontWeight: 400 }}>
                I agree to the terms and conditions
              </label>
            </div>
            <span className="error-msg">{errors.terms || ""}</span>

            {apiError && (
              <p className="error-msg" style={{ marginTop: "0.5rem" }}>
                {apiError}
              </p>
            )}
            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
