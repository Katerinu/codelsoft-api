const { Router } = require('express');
const { authCheck } = require('../controllers/authController');

const authRouter = Router();

authRouter.get("/", authCheck);

module.exports = authRouter;