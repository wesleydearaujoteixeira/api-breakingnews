const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {

    try {
        const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }


    const parts = authorization.split(' ');


    if(parts.length !== 2) {
        return res.send(401);
    }

    const [bearer, token] = parts;


    if( bearer !== "Bearer") {
        return res.send(401);
    }

    jwt.verify(token, process.env.KEY_TOKEN, async (error, decoded) => {
        console.log(error);
        if(error) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        
        console.log(decoded);

        const user = await User.findById(decoded.id);
        

        if(!user && !user.id) {
            return res.status(403).json({ message: 'Token é inválido! ' });
        }

        req.userId = user.id;
        next();

    });

    } catch (error) {
        res.status(500).json({ message: " erro é esse: " + error.message });
    }

}

module.exports = { authMiddleware };