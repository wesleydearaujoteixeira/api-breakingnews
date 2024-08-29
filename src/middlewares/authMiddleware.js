const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Verifica se o token está presente
        if (!authorization) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const parts = authorization.split(' ');

        // Verifica o formato do token
        if (parts.length !== 2) {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        const [bearer, token] = parts;

        if (bearer !== 'Bearer') {
            return res.status(401).json({ message: 'Token mal formatado' });
        }

        // Verifica e decodifica o token
        jwt.verify(token, process.env.KEY_TOKEN, async (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'Token inválido' });
            }

            console.log('Decoded token:', decoded);

            // Busca o usuário no banco de dados
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(403).json({ message: 'Usuário não encontrado' });
            }

            // Armazena o ID do usuário na requisição
            req.userId = decoded.id;
            next(); // Chama o próximo middleware ou rota
        });

    } catch (error) {
        console.error('Erro no middleware de autenticação:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
};

module.exports = { authMiddleware };
