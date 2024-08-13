const mongoose = require('mongoose');
const service = require('../services/user-service');

const validId = (req, res, next) => {


    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    next();
}



const validUser = async (req, res, next) => {

    const { id } = req.params;

    const user = await service.getUserById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    next()

}

module.exports = {
    validId,
    validUser
}