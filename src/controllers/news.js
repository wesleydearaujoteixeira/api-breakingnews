const services = require('../services/user-service');
const mongoose = require('mongoose');

async function Create(req, res) {
    const { name, username, email, password, avatar, background } = req.body;

    // Validation
    if (!name || !username || !email || !password || !avatar || !background) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Create user
        const user = await services.create({ name, username, email, password, avatar, background });

        if (!user) {
            return res.status(400).json({ message: 'Failed to create user!' });
        }

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                background: user.background,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}


async function FindAllUsers(req, res) {
   
    const user = await services.findUsers();

    if(user.length === 0) {
        return res.status(404).json({ message: 'No users found' });
    }
    
    res.status(200).json({
        user,
    })

}

async function FindUserById(req, res) {

    const userId = req.params.id;


    if(!mongoose.Types.ObjectId.isValid(userId)) {

        return res.status(400).json({ message: 'Invalid user ID' });

    }


    const user = await services.getUserById(userId);

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        user,
    })
}


module.exports = { Create, FindAllUsers, FindUserById};
