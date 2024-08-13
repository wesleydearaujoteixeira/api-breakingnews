const route = require('express').Router();
const controllers = require('../controllers/news');
const {validId, validUser  } = require('../middlewares/global.middlewares')

route.post('/create', controllers.Create);
route.get('/', controllers.FindAllUsers);
route.get('/:id', validId, validUser, controllers.FindUserById);
route.patch('/update/:id', validId, validUser, controllers.UpdateUser);


module.exports = route;