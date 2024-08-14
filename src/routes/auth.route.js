const router = require('express').Router();
const authController = require('../controllers/auth.controllers');

router.post('/login', authController.Login);

module.exports =  router;