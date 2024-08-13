const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        required: true
    },
    background: {
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function (next) {
    // Hnpm ash the password before saving it to the database
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Create a model based on the schema and export it
module.exports = mongoose.model('User', UserSchema);
