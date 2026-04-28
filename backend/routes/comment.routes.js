// backend/routes/comment.routes.js
const express           = require('express');
const Comment           = require('../models/Comment');
const Post              = require('../models/Post');
const { protect }       = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');

const router = express.Router();

// GET /api/comments/:postId — public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePic')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/comments/:postId — member or admin
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.create({
      post:   req.params.postId,
      author: req.user._id,
      body:   req.body.body,
    });
    await comment.populate('author', 'name profilePic');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/comments/:id — comment owner, post author, or admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // If not comment owner or admin, check if user is the post author
    let isPostAuthor = false;
    if (!isCommentOwner && !isAdmin) {
      const post = await Post.findById(comment.post);
      if (post && post.author.toString() === req.user._id.toString()) {
        isPostAuthor = true;
      }
    }

    if (!isCommentOwner && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
