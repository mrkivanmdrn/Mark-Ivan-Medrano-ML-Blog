// src/pages/ContactPage.js
import { useState } from "react";
import mlResources from "../data/mlResources";

const ML_LINKS = [
  {
    url: "https://www.mobilelegends.com/",
    name: "ML Official Site",
    desc: "Official news, patch notes, and hero updates from Moonton",
  },
  {
    url: "https://www.reddit.com/r/MobileLegendsGame/",
    name: "Reddit ML",
    desc: "Community discussions, highlights, and strategy threads",
  },
  {
    url: "https://discord.com/invite/mobilelegendsbangbang",
    name: "ML Discord",
    desc: "Real-time chat with players and moderators",
  },
  {
    url: "https://www.youtube.com/@GosuGeneralML",
    name: "Gosu General",
    desc: "Top-tier hero guides and ranked tips on YouTube",
  },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  else if (form.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Please enter a valid email.";
  if (!form.experience)
    errors.experience = "Please select your experience level.";
  if (!form.message.trim()) errors.message = "Message is required.";
  else if (form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlur = (field) => {
    const e = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: e[field] || "" }));
  };
  const handleSubmit = () => {
    const e = validate(formData);
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  if (submitted)
    return (
      <main className="main-content">
        <div className="success-screen">
          <div style={{ fontSize: "3rem" }}>⚔️</div>
          <h2>Message Sent!</h2>
          <p>Thanks for reaching out. I'll reply as soon as possible.</p>
          <button
            className="btn-primary"
            style={{ marginTop: "1.5rem" }}
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", experience: "", message: "" });
            }}
          >
            Send Another Message
          </button>
        </div>
      </main>
    );

  return (
    <main className="main-content">
      <section className="content-section">
        <h2 className="section-heading">Get in Touch</h2>
        <p>
          Questions about ML? Want to connect with a fellow player? I'd love to
          hear from you!
        </p>
      </section>

      {/* Contact form */}
      <section className="content-section">
        <h2 className="section-heading">Send Me a Message</h2>
        <div className="form-wrapper">
          {[
            {
              id: "name",
              label: "Your Name",
              type: "text",
              ph: "Enter your full name",
            },
            {
              id: "email",
              label: "Your Email",
              type: "email",
              ph: "your.email@example.com",
            },
          ].map(({ id, label, type, ph }) => (
            <div className="form-field" key={id}>
              <label htmlFor={id}>{label}:</label>
              <input
                id={id}
                name={id}
                type={type}
                className="form-input"
                placeholder={ph}
                value={formData[id]}
                onChange={handleChange}
                onBlur={() => handleBlur(id)}
              />
              <span className="error-msg">{errors[id] || ""}</span>
            </div>
          ))}

          <div className="form-field">
            <label htmlFor="experience">ML Experience Level:</label>
            <select
              id="experience"
              name="experience"
              className="form-input"
              value={formData.experience}
              onChange={handleChange}
              onBlur={() => handleBlur("experience")}
            >
              <option value="">Select your level</option>
              <option value="beginner">Beginner — Just started playing</option>
              <option value="intermediate">
                Intermediate — Playing regularly
              </option>
              <option value="advanced">
                Advanced — Competitive ranked player
              </option>
              <option value="expert">Expert — Tournament-level player</option>
            </select>
            <span className="error-msg">{errors.experience || ""}</span>
          </div>

          <div className="form-field">
            <label htmlFor="message">Your Message:</label>
            <textarea
              id="message"
              name="message"
              className="form-input"
              placeholder="Ask me about ML, share your thoughts, or just say hi!"
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur("message")}
            />
            <span className="error-msg">{errors.message || ""}</span>
          </div>

          <button className="btn-primary" onClick={handleSubmit}>
            Send Message
          </button>
        </div>
      </section>

      {/* Resources table */}
      <section className="content-section">
        <h2 className="section-heading">My Favorite ML Resources</h2>
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {mlResources.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Useful links */}
      <section className="content-section">
        <h2 className="section-heading">Useful ML Websites</h2>
        <ul style={{ marginLeft: "1.5rem" }}>
          {ML_LINKS.map(({ url, name, desc }) => (
            <li key={url} style={{ marginBottom: "0.7rem" }}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>{" "}
              — {desc}
            </li>
          ))}
        </ul>
      </section>

      {/* Find me */}
      <section className="content-section">
        <h2 className="section-heading">Find Me Online</h2>
        <ul style={{ listStyle: "none" }}>
          <li style={{ marginBottom: "0.6rem" }}>
            <strong>ML In-Game Name:</strong> MarkIvan_M
          </li>
          <li style={{ marginBottom: "0.6rem" }}>
            <strong>Server:</strong> Southeast Asia
          </li>
          <li style={{ marginBottom: "0.6rem" }}>
            <strong>Campus Club:</strong> DMMMSU-SLUC ML Community (meets every
            Friday)
          </li>
        </ul>
      </section>

      {/* Map */}
      <section className="content-section">
        <h2 className="section-heading">Campus Location</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d489619.72362172836!2d120.03498220222437!3d16.51831662563486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33917765554a3123%3A0x4b47191dcdf995a0!2sDon%20Mariano%20Marcos%20Memorial%20State%20University%20-%20South%20La%20Union!5e0!3m2!1sen!2sph!4v1768352888030!5m2!1sen!2sph"
            width="100%"
            height="400"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DMMMSU-SLUC campus map"
          />
        </div>
        <p className="map-caption">
          Dona Toribia Aspiras Road, Agoo, 2504, La Union
        </p>
      </section>
    </main>
  );
}

export default ContactPage;
