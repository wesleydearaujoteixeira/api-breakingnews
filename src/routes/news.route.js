const route = require('express').Router();
const newsControler = require('../controllers/newsController');

// middlewares of the token;

const { authMiddleware } = require('../middlewares/authMiddleware');
const { validFields } = require('../middlewares/global.middlewares');

route.post('/post', authMiddleware,  newsControler.Post);
route.get('/getAll', newsControler.GetAllPosts);
route.get('/top', newsControler.TopNews);
route.get('/search', newsControler.Search);
route.get('/byUser', authMiddleware,  newsControler.byUser);


route.patch('/:id', authMiddleware, validFields, newsControler.updateUser);
route.get('/:id', authMiddleware, newsControler.GetInformation);
route.delete('/:id', authMiddleware, newsControler.DeletePost);
route.patch('/likes/:id', authMiddleware, newsControler.likePost);


route.patch('/comments/:id', authMiddleware, newsControler.commentsPost);
route.patch('/comments/:id/:idComment', authMiddleware, newsControler.deleteComment);

module.exports = route;