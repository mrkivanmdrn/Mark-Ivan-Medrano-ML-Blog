// src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import heroImg from '../images/ml-1.jpg';

const API_URL = 'http://localhost:5000';

function HomePage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Failed to load posts:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-content">

      {/* Hero */}
      <section className="hero-section" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="hero-overlay">
          <h2>Welcome to My Favorite Game Portfolio</h2>
          <p>
            I explore creativity, technology, and storytelling through interactive
            digital worlds. Mobile Legends exemplifies this by transforming complex
            systems, player choice, and emergent narratives into a living competitive
            experience.
          </p>
        </div>
      </section>

      {/* Why ML */}
      <section className="content-section">
        <h2 className="section-heading">Why Mobile Legends?</h2>
        <ul>
          {[
            'High Skill Ceiling & Meaningful Mastery',
            'Strategic Complexity Over Mechanical Simplicity',
            'Player Agency & Emergent Gameplay',
            'Engages players emotionally and socially',
          ].map((item, i) => (
            <li key={i} style={{ marginBottom: '0.6rem', fontSize: '1.05rem' }}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Community Posts */}
      <section className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
          <h2 className="section-heading" style={{ marginBottom: 0 }}>Community Posts</h2>
          {user && (
            <Link to="/create-post" className="btn-primary" style={{ textDecoration: 'none' }}>
              + Write a Post
            </Link>
          )}
        </div>

        {loading && <p className="loading-msg">Loading posts...</p>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>
              No posts yet.{' '}
              {user
                ? <Link to="/create-post">Be the first to write one!</Link>
                : <><Link to="/register">Register</Link> to start writing.</>
              }
            </p>
          </div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              {post.image && (
                <img
                  src={`${API_URL}/uploads/${post.image}`}
                  alt={post.title}
                  className="post-card-img"
                />
              )}
              <div className="post-card-body">
                {post.tag && <span className="post-tag">{post.tag}</span>}
                <h3>
                  <Link to={`/posts/${post._id}`} className="post-card-title">
                    {post.title}
                  </Link>
                </h3>
                <p className="post-card-excerpt">
                  {post.body.substring(0, 120)}{post.body.length > 120 ? '…' : ''}
                </p>
                <div className="post-card-meta">
                  <span className="post-author">
                    {post.author?.profilePic && (
                      <img src={`${API_URL}/uploads/${post.author.profilePic}`} alt=""
                        className="author-avatar" />
                    )}
                    {post.author?.name}
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/posts/${post._id}`} className="read-more">Read more →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore cards */}
      <section className="content-section">
        <h2 className="section-heading">Explore More</h2>
        <div className="preview-grid">
          {[
            { title: 'About Me',          desc: 'Discover my journey with Mobile Legends, my passion for design, and what the game has taught me.',                      to: '/about' },
            { title: 'Gallery',           desc: 'Photos and highlights from tournaments, team outings, and memorable in-game moments.',                                  to: '/gallery' },
            { title: 'Join the Community', desc: 'Sign up to write posts, leave comments, and connect with other Mobile Legends enthusiasts.',                           to: '/register' },
          ].map(card => (
            <Link key={card.title} to={card.to} className="preview-card" style={{ textDecoration: 'none' }}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

export default HomePage;
