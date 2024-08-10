const route = require('express').Router();
const controllers = require('../controllers/news');


route.post('/create', controllers.Create);
route.get('/', controllers.FindAllUsers);
route.get('/:id', controllers.FindUserById);

module.exports = route;