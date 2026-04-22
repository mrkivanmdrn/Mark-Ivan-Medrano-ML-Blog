// src/components/Navbar.js
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("mlTheme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mlTheme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };
  const active = (path) => (location.pathname === path ? "active" : "");

  const linkStyle = {
    color: "var(--nav-text)",
    fontWeight: 600,
    padding: "0.45rem 0.9rem",
    borderRadius: "5px",
    textDecoration: "none",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "0.95rem",
    transition: "background 0.2s",
  };

  return (
    <header
      style={{
        background: "var(--nav-bg)",
        padding: "1.2rem 2rem",
        borderBottom: "3px solid var(--accent)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: "0.8rem" }}>
        <h1
          style={{
            color: "var(--accent)",
            fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: 1,
            marginBottom: "0.1rem",
          }}
        >
          ⚔ My Portfolio | Mark Ivan Medrano
        </h1>
        <p
          style={{
            fontStyle: "italic",
            color: "var(--nav-text)",
            fontSize: "0.9rem",
          }}
        >
          Mobile Legends · Strategy · Community
        </p>
      </div>

      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            justifyContent: "center",
            gap: "0.4rem",
            flexWrap: "wrap",
            alignItems: "center",
            padding: 0,
            margin: 0,
          }}
        >
          {/* Always visible */}
          <li>
            <Link to="/home" style={linkStyle} className={active("/home")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" style={linkStyle} className={active("/about")}>
              About
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              style={linkStyle}
              className={active("/gallery")}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              style={linkStyle}
              className={active("/contact")}
            >
              Contact
            </Link>
          </li>

          {/* Guest only */}
          {!user && (
            <>
              <li>
                <Link
                  to="/register"
                  style={linkStyle}
                  className={active("/register")}
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  style={linkStyle}
                  className={active("/login")}
                >
                  Login
                </Link>
              </li>
            </>
          )}

          {/* Logged-in */}
          {user && (
            <>
              <li>
                <Link
                  to="/create-post"
                  style={linkStyle}
                  className={active("/create-post")}
                >
                  ✏ Write
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  style={linkStyle}
                  className={active("/profile")}
                >
                  {user.profilePic ? (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${user.profilePic}`}
                      alt=""
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        objectFit: "cover",
                        verticalAlign: "middle",
                        marginRight: 5,
                      }}
                    />
                  ) : null}
                  {user.name}
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    style={{
                      ...linkStyle,
                      background: "var(--accent)",
                      color: "#1a1a1a",
                    }}
                    className={active("/admin")}
                  >
                    ⭐ Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    ...linkStyle,
                    background: "transparent",
                    border: "1px solid var(--nav-text)",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {/* Theme toggle */}
          <li>
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              style={{
                background: "transparent",
                border: "2px solid var(--accent)",
                color: "var(--nav-text)",
                padding: "0.35rem 0.9rem",
                borderRadius: "25px",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.85rem",
              }}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
