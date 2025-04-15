/*Importes del controlador y el router de express para que este archivo funcione como el enrutador de el auth.*/
const { Router } = require('express');
const { authCheck } = require('../controllers/authController');

/*Configuracion del router para que funcione como el enrutador de el auth.*/
const authRouter = Router();

/*Configuracion de la ruta base para el auth.
Aqui deben ir todas las rutas necesarias*/
authRouter.get("/", authCheck);

/*Exporte del modulo para ser llamado en app.js*/
module.exports = authRouter;