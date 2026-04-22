// backend/server.js
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');

const authRoutes    = require('./routes/auth.routes');
const postRoutes    = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes   = require('./routes/admin.routes');

const app = express();

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mark-ivan-medrano-ml-blog.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images publicly
// e.g. http://localhost:5000/uploads/1719123456789.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth',     authRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'ML Portfolio Blog API is running ✔' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
