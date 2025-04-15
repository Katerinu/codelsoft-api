/*Importes del controlador y el router de express para que este archivo funcione como el enrutador de users.*/
const { Router } = require('express');
const { usersCheck } = require('../controllers/usersController');

/*Configuracion del router para que funcione como el enrutador de users.*/
const usersRouter = Router();

/*Configuracion de la ruta base para users.
Aqui deben ir todas las rutas necesarias*/
usersRouter.get("/", usersCheck);

/*Exporte del modulo para ser llamado en app.js*/
module.exports = usersRouter;
