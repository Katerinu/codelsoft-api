/*Importes del controlador y el router de express para que este archivo funcione como el enrutador de video.*/
const { Router } = require('express');
const { videoCheck } = require('../controllers/videoController');

/*Configuracion del router para que funcione como el enrutador de video.*/
const videoRouter = Router();

/*Configuracion de la ruta base para video.
Aqui deben ir todas las rutas necesarias*/
videoRouter.get("/", videoCheck);

/*Exporte del modulo para ser llamado en app.js*/
module.exports = videoRouter;
