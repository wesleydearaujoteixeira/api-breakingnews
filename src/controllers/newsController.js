const News = require('../models/News');
const mongoose = require('mongoose');

const Post = async (req, res) => {
    const { title, text, banner } = req.body;

    // Validação dos campos obrigatórios
    if (!title || !text || !banner) {
        return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    try {
        // Criação do novo documento
        const newNews = await News.create({
            title,
            text,
            banner,
            user: { _id: "66b6f9abaf9ff937e7697ade"} // Use uma nova instância de ObjectId se necessário
        });

        // Responder com uma mensagem de sucesso e os detalhes do novo documento
        res.status(201).json({ message: 'Notícia criada com sucesso', news: newNews });

    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const GetAllPosts = async (req, res) => {
    try {
        // Obter todas as notícias
        const news = await News.find();

        res.status(200)
        .json({message: 'Todas as noticias', news})

    }catch (error) {
        console.error("Erro ao buscar notícias:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }

}
module.exports = { Post, GetAllPosts};
