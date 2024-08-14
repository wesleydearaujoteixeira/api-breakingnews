const mongoose = require('mongoose');

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

        likes: {
            type: Array,
            required: true
        },

        comments: {
            type: Array,
            required: true
        },


        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('New', NewSchema);
