const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


async function Login(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça e-mail e senha' });
        }

        const user = await User.findOne({ email: email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Registrar detalhes do usuário para depuração (não exponha informações sensíveis em produção)
        console.log('Usuário encontrado:', user);

        // Verificar se user.password é uma string e não undefined ou null
        if (typeof user.password !== 'string') {
            throw new Error('Senha do usuário não é uma string válida');
        }

        // Comparar senhas usando bcrypt
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        const generateToken = jwt.sign({id: user.id}, process.env.KEY_TOKEN, {expiresIn: 86400}
                  // Token expira em 24 horas ( segundos)
        );
        // Senha é válida, responder com o objeto do usuário (omitir informações sensíveis)
            
        res.status(200)
        .json( { message: 'Login bem-sucedido', 
        user: {email: user.email, token: generateToken}});

    } catch (error) {
        console.error("Ocorreu um erro:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { Login };
