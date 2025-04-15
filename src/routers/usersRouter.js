const { Router } = require('express');
const { usersCheck } = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get("/", usersCheck);

module.exports = usersRouter;
