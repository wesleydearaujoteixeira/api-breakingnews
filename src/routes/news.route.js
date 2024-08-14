const route = require('express').Router();
const newsControler = require('../controllers/newsController');

//const {validId, validUser} = require('../middlewares/global.middlewares')

route.post('/post', newsControler.Post);
route.get('/', newsControler.GetAllPosts);

module.exports = route;