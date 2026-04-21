// src/pages/SplashPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SplashPage() {
  const [dots, setDots] = useState("...");
  const navigate = useNavigate();

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    const redirect = setTimeout(() => {
      clearInterval(dotInterval);
      navigate("/home");
    }, 3000);
    return () => {
      clearInterval(dotInterval);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-icon">⚔️</div>
      <h1>My Portfolio</h1>
      <p
        style={{
          fontStyle: "italic",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "2rem",
        }}
      >
        Mark Ivan Medrano · Mobile Legends · DMMMSU-SLUC
      </p>
      <div className="spinner" />
      <p className="loading-text">Loading{dots}</p>
    </div>
  );
}

export default SplashPage;
