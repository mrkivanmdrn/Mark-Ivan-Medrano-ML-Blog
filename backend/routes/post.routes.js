// backend/routes/post.routes.js
const express           = require('express');
const Post              = require('../models/Post');
const { protect }       = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload            = require('../middleware/upload');
const fs                = require('fs');
const path              = require('path');

const router = express.Router();

const deleteFileIfExists = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error('Failed to delete file:', filePath, err.message);
  });
};

// GET /api/posts — public, all published posts newest first
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/posts/:id — public, single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
    if (!post || post.status === 'removed')
      return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/posts — member or admin
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body, tag } = req.body;
    const image = req.file ? req.file.filename : '';
    const post  = await Post.create({ title, body, tag: tag || 'General', image, author: req.user._id });
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/posts/:id — owner or admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    const oldImage = post.image;

    if (req.file) {
      post.image = req.file.filename;
    }
    if (req.body.title) post.title = req.body.title;
    if (req.body.body)  post.body  = req.body.body;
    if (req.body.tag)   post.tag   = req.body.tag;

    await post.save();

    // Delete old image after successful update
    if (req.file && oldImage) {
      deleteFileIfExists(oldImage);
    }

    await post.populate('author', 'name profilePic');
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/posts/:id — owner or admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    // Delete associated image file if exists
    if (post.image) deleteFileIfExists(post.image);

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
