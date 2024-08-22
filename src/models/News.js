const mongoose = require('mongoose');

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

// Adiciona um índice único para evitar duplicações de userId em likes
NewSchema.index({ "likes.userId": 1 }, { unique: true });

module.exports = mongoose.model('New', NewSchema);
