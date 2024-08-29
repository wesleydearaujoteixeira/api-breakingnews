const mongoose = require('mongoose');

// Define o esquema para notícias
const PostSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });


module.exports = mongoose.model('New', PostSchema);
