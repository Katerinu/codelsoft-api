const { Router } = require('express');
const { billsCheck } = require('../controllers/billsController');

const billsRouter = Router();

billsRouter.get("/", billsCheck);

module.exports = billsRouter;
