// src/pages/GalleryPage.js
import {
  galleryImages,
  gameHighlights,
  tacticDiagrams,
} from "../data/galleryImages";

function GalleryPage() {
  return (
    <main className="main-content">
      <section className="content-section" style={{ textAlign: "center" }}>
        <h2 className="section-heading">My ML Gallery</h2>
        <p
          style={{
            maxWidth: 760,
            margin: "0 auto",
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
          }}
        >
          Snapshots of memorable moments — from clutch team fights to tournament
          brackets and late-night ranked sessions with friends.
        </p>
      </section>

      {/* Photo grid */}
      <section className="content-section">
        <h2 className="section-heading">Moments from the Game</h2>
        <div className="gallery-grid">
          {galleryImages.map(({ id, src, caption, alt }) => (
            <div key={id} className="gallery-item">
              <img
                src={src}
                alt={alt}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="image-caption">{caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Game highlights */}
      <section className="content-section">
        <h2 className="section-heading">Memorable Moments & Achievements</h2>
        {gameHighlights.map(({ id, title, date, body }) => (
          <div key={id} className="game-highlight">
            <h3>{title}</h3>
            <p className="game-date">{date}</p>
            <p>{body}</p>
          </div>
        ))}
      </section>

      {/* Tactic diagrams */}
      <section className="content-section">
        <h2 className="section-heading">Key Tactical Concepts</h2>
        <p style={{ marginBottom: "1rem" }}>
          Visual references for some of the core concepts I study and apply in
          ranked games:
        </p>
        <div className="diagrams-grid">
          {tacticDiagrams.map(({ id, src, caption }) => (
            <div key={id} className="diagram-item">
              <img
                src={src}
                alt={caption}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="diagram-caption">{caption}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default GalleryPage;
