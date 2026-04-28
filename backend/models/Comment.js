// backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post',   required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
    body:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Index for querying comments by post
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);
