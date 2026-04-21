// src/pages/AboutPage.js
const TIMELINE = [
  {
    label: "Month 1-3 (Complete Beginner)",
    body: "Learned all hero roles, basic map mechanics, and played first 100 ranked games, losing most of them but picking up fundamentals fast.",
  },
  {
    label: "Month 4-6 (Early Learning)",
    body: "Discovered the importance of objectives over kills. Started maining Assassin and Fighter roles, reached Gold tier.",
  },
  {
    label: "Month 7-12 (Building Foundation)",
    body: "Studied pro-player streams, completed hundreds of custom games to improve mechanics, broke into Platinum tier.",
  },
  {
    label: "Year 2 (Steady Improvement)",
    body: "Joined a campus team, participated in inter-school scrimmages, developed a two-hero pool for ranked consistency. Reached Epic.",
  },
  {
    label: "Year 3 (Current Stage)",
    body: "Pushing for Mythic, studying draft theory and macro play, mentoring newer players in the campus club.",
  },
  {
    label: "Future Goals",
    body: "Reach Mythic Glory, compete in DMMMSU inter-school tournament, and build a full ML strategy content platform.",
  },
];

const LESSONS = [
  {
    title: "Patience and Decision-Making",
    body: "Rushing in without vision gets you killed every time. I've learned to slow down, assess the map, and act with purpose.",
  },
  {
    title: "Teamwork over Solo Carry",
    body: "The best play isn't always the flashy 1v5. Setting up teammates, peeling, and communicating are often what wins games.",
  },
  {
    title: "Learning from Defeat",
    body: "Every loss has a replay. I review mine to find the one moment that changed the game - that habit has accelerated my improvement more than anything else.",
  },
];

function AboutPage() {
  return (
    <main className="main-content">
      <section className="content-section">
        <h2 className="section-heading">About My Mobile Legends Journey</h2>
        <p>
          Mobile Legends is more than a game to me — it's a space where
          strategy, creativity, and teamwork come together. Here's how it all
          started.
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-heading">How I Started Playing</h2>
        <p style={{ marginBottom: "1rem" }}>
          Three years ago a classmate introduced me to Mobile Legends during a
          free period. I was hooked immediately — the diversity of heroes, the
          depth of each role, and the way a single coordinated team fight could
          swing an entire game.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          My first 200 games were humbling. I fed constantly, misunderstood
          objectives, and blamed teammates. But a mentor in my dorm showed me
          how to watch replays critically, and everything changed.
        </p>
        <p>
          Within six months I understood itemization, map rotation, and why
          objective control matters more than a perfect KDA.
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-heading">What ML Has Taught Me</h2>
        {LESSONS.map(({ title, body }) => (
          <p key={title} style={{ marginBottom: "1rem" }}>
            <strong>{title}:</strong> {body}
          </p>
        ))}
      </section>

      {/* Famous quote */}
      <section className="chess-quote content-section">
        <blockquote>
          <p>"Games are the most elevated form of investigation."</p>
          <cite>— Albert Einstein</cite>
        </blockquote>
      </section>

      {/* Timeline */}
      <section className="content-section">
        <h2 className="section-heading">My Learning Timeline</h2>
        <p style={{ marginBottom: "1rem" }}>
          Here's how my ML journey has progressed from complete beginner to
          where I am today:
        </p>
        <ol style={{ marginLeft: "1.5rem" }}>
          {TIMELINE.map(({ label, body }) => (
            <li key={label} style={{ marginBottom: "0.8rem", lineHeight: 1.8 }}>
              <strong>{label}:</strong> {body}
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section">
        <h2 className="section-heading">Why I Love Mobile Legends</h2>
        <p style={{ marginBottom: "1rem" }}>
          Mobile Legends captivates me because the meta never stays still. Every
          patch introduces new dynamics, and adapting to change is a skill that
          extends far beyond the game.
        </p>
        <p>
          Most importantly, the friends I've made through ML — at school, in my
          dorm, and online — are some of the most creative and competitive
          people I know. This game builds community.
        </p>
      </section>
    </main>
  );
}

export default AboutPage;
