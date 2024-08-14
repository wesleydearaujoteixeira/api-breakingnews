const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const conectDB = () => {
    mongoose.connect(process.env.MONGO_ATLAS)
       .then(() => console.log('MongoDB Connected!'))
       .catch(err => console.log('Error connecting to MongoDB:', err));
}

module.exports = conectDB;
