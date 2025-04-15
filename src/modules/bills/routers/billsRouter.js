/*Importes del controlador y el router de express para que este archivo funcione como el enrutador de bills.*/
const { Router } = require('express');
const { billsCheck } = require('../controllers/billsController');

/*Configuracion del router para que funcione como el enrutador de bills.*/
const billsRouter = Router();

/*Configuracion de la ruta base para bills.
Aqui deben ir todas las rutas necesarias*/
billsRouter.get("/", billsCheck);

/*Exporte del modulo para ser llamado en app.js*/
module.exports = billsRouter;
