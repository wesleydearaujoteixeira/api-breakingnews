const route = require('express').Router();
const controllers = require('../controllers/news');


route.post('/create', controllers.Create);
route.get('/get/:id', controllers.Get);



module.exports = route;