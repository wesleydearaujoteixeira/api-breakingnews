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
            user: req.userId // Use uma nova instância de ObjectId se necessário
        });

        // Responder com uma mensagem de sucesso e os detalhes do novo documento
        res.status(201).json({ message: 'Notícia criada com sucesso', news: newNews });

    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const GetAllPosts = async (req, res) => {


    let {limit, offset} = req.query;


    limit = parseInt(limit) || 5;
    offset = parseInt(offset) || 0;

    if(!limit) {
        limit = 5;
    }
    if(!offset) {
        offset = 0;
    }


    try {
        // Obter todas as notícias
        const news = await News.find().sort({_id: -1}).skip(offset).limit(limit).populate("user");

        const currentUrl = req.baseUrl;
        const total = await News.countDocuments();

        const next = offset + limit;
        const nextURL = offset < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;

        const previousURL = previous !== null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;



        res.status(200)
        .json({message: 'Todas as noticias',
            pagination: {
                total,
                limit,
                offset,
                next,
                previous,
                nextURL,
                previousURL
            },

            results: news.map((item) => {

                return {
                    id: item._id,
                    title: item.title,
                    text: item.text,
                    banner: item.banner,
                    createdAt: item.createdAt,
                    likes: item.likes,
                    comments: item.comments,
                    username: item.user.username,
                    avatar: item.user.avatar,
                }
            })
        })

    }catch (error) {
        console.error("Erro ao buscar notícias:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }

}


const TopNews = async (req, res) => {
    try {
        // Obter as notícias mais populares
        const news = await News.findOne().sort({ _id: -1 }).populate("user");

        if(!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }


        res.status(200)
       .json({ news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                username: news.user.username,
                avatar: news.user.avatar,
            }}
        )


    } catch (error) {
        console.error("Erro ao buscar notícias mais populares:", error);
        res.status(500).json({message: 'Erro interno do servidor' });
    }

}

module.exports = { Post, GetAllPosts, TopNews}
