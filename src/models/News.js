const mongoose = require('mongoose');

// Define o esquema para posts
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        }
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Cria um índice único para garantir que cada usuário possa curtir um post apenas uma vez
PostSchema.index({ _id: 1, 'likes.userId': 1 }, { unique: true });

// Define o modelo
module.exports = mongoose.model('Post', PostSchema);
