const News = require('../models/News');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb'); // Certifique-se de que você está importando ObjectId corretamente

const User = require('../models/User');

const Post = async (req, res) => {
    const { title, text, banner } = req.body;

    const { id } = req.params;



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
            user: new ObjectId(id)  // Use uma nova instância de ObjectId se necessário
        });

        // Responder com uma mensagem de sucesso e os detalhes do novo documento
        res.status(201).json({ message: 'Notícia criada com sucesso', news: newNews });

    } catch (error) {
        //console.error("Erro ao criar notícia:", error);
        res.status(500).json({ message: 'Erro interno do servidor detalhes', error });
    }
};

const GetAllPosts = async (req, res) => {


    let {limit, offset} = req.query;


    limit = parseInt(limit) || 8;
    offset = parseInt(offset) || 0;

    if(!limit) {
        limit = 8;
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


const GetInformation = async (req, res) => {

    try {
        
        const { id } = req.params;

    const news = await News.findById(id).populate("user");

    if(!news) {
        res.status(404).json({message: 'Not found'});

    }


    res.status(200).json({ 
        news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        username: news.user.username,
        avatar: news.user.avatar,
    }
    });


    } catch (error) {
        console.error("Erro interno do servidor):", error);
        res.status(500).json({ message: 'Erro interno do servidor' });    
    }



}

const Search = async (req, res) => {
    try {
        const { title } = req.query;

        const news = await News.find({ title: new RegExp(title, 'i') }).sort({_id: -1 }).populate("user");


        if(!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }


        res.status(200).json({ news: news.map((item) => { 
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
            }})
        }
    )

    }
    catch (error) {
        console.error("Erro interno do servidor:", error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }


}

const byUser = async (req, res) => {

    try {
        
        const id = req.userId;
        const news = await News.find({user: id}).sort({ _id: -1 }).populate("user");
    
    
        res.status(200).json({ news: news.map((item) => { 
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
            }})
            
    });


    } catch (error) {
        console.error("O erro interno do servidor", error.message);
        res.status(500).json({ message: 'Erro interno do servidor ' + error.message });
    }

}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text, banner } = req.body;

        // Valida se o ID é um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        // Encontra o item de notícia para garantir que ele existe e está associado ao usuário
        const news = await News.findById(id);

        // Verifica se a notícia existe
        if (!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }

        // Garante que o usuário está autorizado a atualizar este item de notícia
        if (news.user._id.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        // Atualiza o item de notícia
        const updatedNews = await News.findByIdAndUpdate(
            id,
            { title, text, banner },
            { new: true, runValidators: true } // runValidators garante que as validações do modelo sejam aplicadas
        ).populate('user'); // Popula as informações do usuário se necessário

        // Retorna a notícia atualizada
        res.status(200).json({ message: 'Notícia atualizada com sucesso', news: updatedNews });
    } catch (error) {
        console.error("Ocorreu um erro interno", error.message);
        res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
};


const DeletePost = async (req, res) => {
    
    try {
        const { id } = req.params;

        // Find the news item by ID
        const news = await News.findById(id);

        // Check if the news item exists
        if (!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }

        // Ensure the user is authorized to delete this news item
        if (news.user._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

        // Delete the news item
        await News.findByIdAndDelete({_id: id});

        // Respond with a success message
        res.status(200).json({ message: 'Notícia deletada com sucesso' });
    } catch (error) {
        
        console.error("Ocorreu um erro interno", error.message);
        res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
}


const likePost = async (req, res) => {
    try {
        const { idNews, idUser } = req.params;  // Recebe os parâmetros da rota

        // Validação dos parâmetros
        if (!idNews || !idUser) {
            return res.status(400).json({ message: 'ID do post ou ID do usuário não fornecido.' });
        }

        // Verifica se o usuário existe
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Verifica se o post existe
        const post = await News.findById(idNews);
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica se o usuário já curtiu o post
        const alreadyLiked = post.likes.some(like => like.userId.toString() === idUser.toString());

        if (alreadyLiked) {
            // Remove o like se já estiver presente
            const updatedPost = await News.findOneAndUpdate(
                { _id: idNews, 'likes.userId': idUser },  // Filtro deve ser um objeto
                {
                    $pull: {
                        likes: { userId: idUser }
                    }
                },
                { new: true }  // Retorna o documento atualizado
            );

            return res.status(200).json({ message: 'Like removido com sucesso', news: updatedPost });
        } else {
            // Adiciona o like se não estiver presente
            const updatedPost = await News.findOneAndUpdate(
                { _id: idNews },  // Filtro deve ser um objeto
                {
                    $push: {
                        likes: { userId: idUser, created: new Date() }
                    }
                },
                { new: true }  // Retorna o documento atualizado
            );

            return res.status(200).json({ message: 'Like adicionado com sucesso', news: updatedPost });
        }
    } catch (error) {
        console.error('Ocorreu um erro interno:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
};






const commentsPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body; // Use 'text' para o corpo da requisição
        const userId = req.userId;

        // Validação dos parâmetros
        if (!id || !text || !userId) {
            return res.status(400).json({ message: 'ID do post, texto do comentário ou ID do usuário não fornecido.' });
        }

        // Gera um ID único para o comentário
        const idComment = Math.floor(Math.random() * Date.now()).toString(36);

        // Atualiza o post com o novo comentário
        const updatedPost = await News.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    comments: {
                        idComment,
                        userId,
                        text,
                        createdAt: new Date() // Usa Date() para criar a data atual
                    }
                }
            },
            { new: true } // Retorna o documento atualizado
        );

        res.status(200).json({ message: "Post com o novo comentário", post: updatedPost})

    } catch (err) {
        console.error('Ocorreu um erro interno:', err.message);
        res.status(500).json({ message: 'Erro interno do servidor:'+ err.message });
    }

}



const deleteComment = async (req, res) => {
    try {
        const { id, idComment } = req.params;
        const userId = req.userId;

        // Validação dos parâmetros
        if (!id || !idComment || !userId) {
            return res.status(400).json({ message: 'ID do post, ID do comentário ou ID do usuário não fornecido.' });
        }

        // Remove espaços extras
        const cleanedId = id.trim();
        const cleanedIdComment = idComment.trim();
        const cleanedUserId = userId.trim();

        // Valida se os IDs são ObjectId válidos
        if (!mongoose.Types.ObjectId.isValid(cleanedId)) {
            return res.status(400).json({ message: 'ID do post inválido.' });
        }

        if (!mongoose.Types.ObjectId.isValid(cleanedIdComment)) {
            return res.status(400).json({ message: 'ID do comentário inválido.' });
        }

        if (!mongoose.Types.ObjectId.isValid(cleanedUserId)) {
            return res.status(400).json({ message: 'ID do usuário inválido.' });
        }

        // Remove o comentário específico do array de comentários do post
        const updatedPost = await News.findOneAndUpdate(
            { 
                _id: cleanedId, 
                'comments._id': cleanedIdComment, 
                'comments.userId': cleanedUserId 
            },
            { 
                $pull: { 
                    comments: { 
                        _id: cleanedIdComment
                    } 
                } 
            },
            { 
                new: true, // Retorna o documento atualizado
                useFindAndModify: false // Para evitar aviso de deprecated
            }
        );
        
        // Verifica se o documento foi encontrado e atualizado
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post ou comentário não encontrado.' });
        }

        // Responde com o post atualizado e uma mensagem de sucesso
        res.status(200).json({ message: 'Comentário deletado com sucesso.', post: updatedPost });

    } catch (error) {
        console.error('Ocorreu um erro interno:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor: ' + error.message });
    }
};




module.exports = { Post, GetAllPosts, TopNews, GetInformation, Search, byUser, updateUser, DeletePost, likePost, commentsPost, deleteComment};
