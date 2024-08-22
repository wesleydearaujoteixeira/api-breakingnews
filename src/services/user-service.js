const User = require('../models/User');
const { ObjectId } = require('mongodb'); // Importar ObjectId se não estiver disponível globalmente

const create = (body) => User.create(body);
const findUsers = () => User.find();
const getUserById = (id) => User.findById(id);


const updateUser = async (
    id,
    name, 
    username, 
    email, 
    password, 
    avatar, 
    background 
) => {
    try {
        // Construir o objeto de atualização dinamicamente
        const updateFields = {};
        if (name) updateFields.name = name;
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (password) updateFields.password = password;
        if (avatar) updateFields.avatar = avatar;
        if (background) updateFields.background = background;
        
        // Atualizar o documento e retornar o documento atualizado
        return await User.findOneAndUpdate(
            { _id: id }, 
            { $set: updateFields }, 
            { new: true } // Para retornar o documento atualizado
        );
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};


module.exports = {
    create,
    findUsers,
    getUserById,
    updateUser
};