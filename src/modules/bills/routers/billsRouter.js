/*Importacion de los modulos necesarios para la configuracion del router*/
import { Router } from "express";
import { billsCheck, createBill, getBillById, 
         updateBills, deleteBill, userBills
 } from "../controllers/billsController.js";

/*Configuracion del router para que funcione como el enrutador de bills.*/
const billsRouter = Router();

/*Configuracion de la ruta base para bills.
Aqui deben ir todas las rutas necesarias*/
billsRouter.route("/check").get(billsCheck);
billsRouter.route("/").post(createBill).get(userBills);
billsRouter.route("/:id").get(getBillById).patch(updateBills).delete(deleteBill);

/*Exporte del modulo para ser llamado en app.js*/
export default billsRouter;
