import { Router } from 'express';
import { authCheck, login, updatePassword } from '../controllers/authController.js';

/*Configuracion del router para que funcione como el enrutador de el auth.*/
const authRouter = Router();

/*Configuracion de la ruta base para el auth.
Aqui deben ir todas las rutas necesarias*/
authRouter.get("/", authCheck);
authRouter.post("/login", login);
authRouter.patch("/usuarios/:uuid", updatePassword);
/*Exporte del modulo para ser llamado en app.js*/
export default authRouter;