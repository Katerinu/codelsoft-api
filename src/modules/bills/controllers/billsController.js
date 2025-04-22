import { PrismaClient } from "../../../../prisma-bills-database/bills-client/index.js";
import { verifyTokenJWT} from "../../../utils/tokenGenerator.js";

const prisma = new PrismaClient();

/*Metodo de prueba*/
const billsCheck = (req, res) => {
    res.status(200).send("OK Bills Check");
}

// Ver que UUID exista
const createBill = async (req, res ) => {

    // Apartador de token
    const token = req.headers.authorization;
    // Verifica si el usuario está autenticado
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }
    // Verifica si el token es válido
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }
    // Verifica si el usuario tiene permisos de administrador
    if (decodedToken.user.role !== "Administrador") {
        return res.status(403).json({ message: "No tienes permisos para crear facturas" });
    }

    // Apartado de datos
    const { userUuid, billStatus, amount } = req.body;
    // Verifica si se ingresaron todos los datos necesarios para crear la factura
    if (!userUuid || !billStatus || !amount) {
        return res.status(400).json({ message: "Faltan datos para crear la factura" });
    }
    // Verifica si el monto es un número entero y mayor a 0
    if ( amount <= 0 || !Number.isInteger(amount)) {
        return res.status(400).json({ message: "El monto debe ser un número entero mayor a 0" });
    }
    // Verifica si el estado es uno de los permitidos
    const validBillStatuses = ["Pending", "Paid", "Overdue"];
    if (!validBillStatuses.includes(billStatus)) {
        return res.status(400).json({ message: "Estado inválido. Debe ser 'Pending', 'Paid' o 'Overdue'" });
    }
    const newBill = await prisma.bill.create({
        data: {
            userUuid,
            billStatus,
            amount,
        },
    });
    res.status(201).json({ message: "Factura creada", data: newBill });
};

const getBillById = async (req, res) => {
    // // Apartador de token
    const token = req.headers.authorization;
    // Verifica si el usuario está autenticado
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }
    // Verifica si el token es válido
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }
    
    // Apartado de datos
    const { id } = req.params;
    const bill = await prisma.bill.findUnique({
        where: { id: parseInt(id) },
    });
    // Verifica si el usuario tiene permisos de administrador
    if (decodedToken.user.role !== "Administrador" && decodedToken.user.uuid !== bill.userUuid) {
        return res.status(403).json({ message: "No tienes permisos para ver la facturas" });
    }
    if (!bill) {
        return res.status(404).json({ message: "Factura no encontrada" });
    }
    res.status(200).json({ data: bill });
}

const updateBills = async (req, res) => {
    // Apartador de token
    const token = req.headers.authorization;
    // Verifica si el usuario está autenticado
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }
    // Verifica si el token es válido
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }
    // Verifica si el usuario tiene permisos de administrador
    if (decodedToken.user.role !== "Administrador") {
        return res.status(403).json({ message: "No tienes permisos para crear facturas" });
    }

    const { billStatus } = req.body;
    const { id } = req.params;
    // Verifica si se ingresó el ID de la factura
    if (!id) {
        return res.status(400).json({ message: "Falta el ID de la factura" });
    }
    // Verifica si el estado es uno de los permitidos
    const validBillStatuses = ["Pending", "Paid", "Overdue"];
    if (!validBillStatuses.includes(billStatus)) {
        return res.status(400).json({ message: "Estado inválido. Debe ser 'Pending', 'Paid' o 'Overdue'" });
    }

    const updatedBill = await prisma.bill.update({
        where: { id: parseInt(id) },
        data: {
            billStatus,
            paidAt: billStatus === "Paid" ? new Date() : null,
        },
    });

    res.status(200).json({ message: "Factura actualizada", data: updatedBill });

}

const deleteBill = async (req, res) => {
    const { id } = req.params;
    const bill = await prisma.bill.findUnique({
        where: { id: parseInt(id) },
    });

    // Apartador de token
    const token = req.headers.authorization;
    // Verifica si el usuario está autenticado
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }
    // Verifica si el token es válido
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }
    // Verifica si el usuario tiene permisos de administrador
    if (decodedToken.user.role !== "Administrador") {
        return res.status(403).json({ message: "No tienes permisos para eliminar facturas" });
    }

    if (!bill) {
        return res.status(404).json({ message: "Factura no encontrada" });
    }

    if (bill.billStatus === "Paid") {
        return res.status(400).json({ message: "No se puede eliminar una factura pagada" });
    }

    await prisma.bill.update({
        where: { id: parseInt(id) },
        data: { deleted: true },
    });

    res.status(200).json({ message: "Factura eliminada" });
}

const userBills = async (req, res) => {
    // Apartador de token
    const token = req.headers.authorization;
    // Verifica si el usuario está autenticado
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token" });
    }
    // Verifica si el token es válido
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    const { billStatus } = req.query;
    console.log("Status recibido:", billStatus);
    const validStatuses = ["Pending", "Paid", "Overdue"];
    let filter = { };
  
    if (billStatus) {
      if (!validStatuses.includes(billStatus)) {
        return res.status(400).json({ message: "Estado inválido. Usa Pending, Paid o Overdue" });
      }
      filter.billStatus = billStatus;
    }
  
    // Admin ve todas las facturas (con filtros opcionales)
    if (decodedToken.user.role === "Administrador") {
        const bills = await prisma.bill.findMany({ where: filter });
        // desplegar por consola el status que recibe por parametro
        console.log("Status recibido:", billStatus);
        if (bills.length === 0) {
            return res.status(404).json({
                message: billStatus 
                    ? `No se encontraron boletas con estado "${billStatus}"`
                    : "No se encontraron boletas disponibles",
            });
        }
        return res.status(200).json({ data: bills });
    }
  
    // Clientes solo ven sus propias facturas
    filter.userUuid = decodedToken.user.uuid;
    filter.deleted = false;
  
    const bills = await prisma.bill.findMany({ where: filter });
    if (bills.length === 0) {
        return res.status(404).json({
            message: billStatus 
                ? `No se encontraron boletas con estado "${billStatus}"`
                : "No se encontraron boletas disponibles",
        });
    }
    res.status(200).json({ data: bills });
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { 
    billsCheck,
    createBill,
    getBillById,
    updateBills,
    deleteBill,
    userBills
};