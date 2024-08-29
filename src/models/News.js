const mongoose = require('mongoose');

// Define o esquema para likes
const LikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Define o esquema para comentários
const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Define o esquema para notícias
const NewSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        banner: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: [LikeSchema],
        comments: [CommentSchema],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Remova o índice único para evitar problemas

NewSchema.index({ "likes.userId": 1 }, { unique: false });


module.exports = mongoose.model('New', NewSchema);
