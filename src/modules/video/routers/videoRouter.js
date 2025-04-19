/*Importes del controlador y el router de express para que este archivo funcione como el enrutador de video.*/
import { Router } from 'express';
import { videoCheck, uploadVideo, getVideoById, 
        updateVideo, deleteVideo, getVideos} from '../controllers/videoController.js';

/*Configuracion del router para que funcione como el enrutador de video.*/
const videoRouter = Router();

/*Configuracion de la ruta base para video.
Aqui deben ir todas las rutas necesarias*/
videoRouter.get("/check", videoCheck);

videoRouter.route("/").post(uploadVideo).get(getVideos);
videoRouter.route("/:id").get(getVideoById).patch(updateVideo).delete(deleteVideo);

/*Exporte del modulo para ser llamado en app.js*/
export default videoRouter;
