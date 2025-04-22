/*Importes base para el funcionamiento de la API*/
import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './src/utils/mongoORM.js';
import { connectMongoose } from './src/modules/video/controllers/videoController.js';

/*Importes de los routers para asi poder acceder correctamente a las rutas correspondientes.*/
import authRouter from './src/modules/auth/routers/authRouter.js';
import videoRouter from './src/modules/video/routers/videoRouter.js';
import billsRouter from './src/modules/bills/routers/billsRouter.js';
import usersRouter from './src/modules/users/routers/usersRouter.js';
import globalErrorMiddleware from './src/middleware/globalErrorMiddleware.js';

/*Configuracion de dotenv para poder acceder a las variables de entorno.*/
config({path:'.env'});
const PORT = process.env.PORT;
const environment = process.env.NODE_ENV;

/* Validación de variables de entorno necesarias */
if (!process.env.MONGO_DATABASE_VIDEOS || !process.env.MONGO_PASSWORD_VIDEOS || !process.env.MONGO_USER_VIDEOS) {
    throw new Error("Faltan variables de entorno para la base de datos VIDEOS");
}
if (!process.env.MONGO_DATABASE_USERS || !process.env.MONGO_PASSWORD_USERS || !process.env.MONGO_USER_USERS) {
    throw new Error("Faltan variables de entorno para la base de datos USERS");
}

/*Configuracion de mongoose para la conexion a las bases de datos. Se crean instancias para cada una de las bases de datos.*/
await connectMongoose();

/*Conexion a la base de datos de usuarios, se utiliza un ORM personalizado*/
await connectDB();

/*Configuracion de express para el funcionamiento de la API.*/
/*Se añade morgan para visualizar el uso de la API y .json para transformar todo a JSON*/
const app = express();
app.use(express.json());
app.use(morgan('dev'));

/*Configuracion de los routers para poder acceder a las rutas correspondientes. Se les agrega a nuestra app.*/
app.use("/auth", authRouter);
app.use("/videos", videoRouter);
app.use("/bills", billsRouter);
app.use("/usuarios", usersRouter);

/*Ruta base*/
app.get('/', (req, res) => {
    res.status(200).send("OK");
});

app.use(globalErrorMiddleware);

/*Configuracion de la API para que escuche en el puerto correspondiente y se le asigna el entorno.
Esto ademas sirve para ver el estado de la API en la consola.*/
app.listen(PORT,()=> {
    console.log(`Entorno: ${environment}`);
    console.log(`Puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});