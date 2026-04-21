// backend/models/Post.js
// Blog posts for the ML Portfolio community blog
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title:  { type: String, required: true, trim: true },
    body:   { type: String, required: true },
    image:  { type: String, default: '' },   // filename in uploads/
    tag:    { type: String, default: 'General' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['published', 'removed'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
