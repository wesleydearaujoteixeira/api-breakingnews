const User = require('../models/User');

const create = (body) => User.create(body);
const findUsers = () => User.find();
const getUserById = (id) => User.findById(id);



module.exports = {
    create,
    findUsers,
    getUserById,
};