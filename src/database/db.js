const mongoose = require('mongoose');

const conectDB = () => {
    mongoose.connect('mongodb+srv://wesleyaraujoteixeira98:hzZLYBjc3ImT1avD@cluster0.8puv5.mongodb.net/')
       .then(() => console.log('MongoDB Connected!'))
       .catch(err => console.log('Error connecting to MongoDB:', err));
}

module.exports = conectDB;
