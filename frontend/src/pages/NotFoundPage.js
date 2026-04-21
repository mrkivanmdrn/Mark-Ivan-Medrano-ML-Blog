// src/pages/NotFoundPage.js
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="main-content">
      <div
        className="success-screen"
        style={{ textAlign: "center", paddingTop: "4rem" }}
      >
        <div style={{ fontSize: "4rem" }}>⚔️</div>
        <h2 style={{ fontSize: "3rem", margin: "1rem 0" }}>404</h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          This page was eliminated from the match.
        </p>
        <Link
          to="/home"
          className="btn-primary"
          style={{ textDecoration: "none" }}
        >
          Back to Home Base
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
