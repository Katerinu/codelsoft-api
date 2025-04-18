import { Router } from 'express';
import { 
    usersCheck, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getAllUsers 
} from '../controllers/usersController.js';

/*Configuracion del router para que funcione como el enrutador de users.*/
const usersRouter = Router();

/*Configuracion de la ruta base para users.
Aqui deben ir todas las rutas necesarias*/
usersRouter.get("/", getAllUsers);
usersRouter.post("/", createUser)
usersRouter.get("/:id",getUserById);
usersRouter.patch("/:id",updateUser);
usersRouter.delete("/:id",deleteUser);
usersRouter.get("/status", usersCheck);
/*Exporte del modulo para ser llamado en app.js*/
export default usersRouter;
