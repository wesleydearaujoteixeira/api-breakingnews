const route = require('express').Router();
const newsControler = require('../controllers/newsController');

// middlewares of the token

const { authMiddleware } = require('../middlewares/authMiddleware')

route.post('/post', authMiddleware,  newsControler.Post);
route.get('/', newsControler.GetAllPosts);
route.get('/top', newsControler.TopNews);

module.exports = route;