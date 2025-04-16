/*Importes base para el funcionamiento de la API*/
const express = require('express');
const morgan = require('morgan');
const { config } = require('dotenv');
const { connect } = require('mongoose');

/*Importes de los routers para asi poder acceder correctamente a las rutas correspondientes.*/
const authRouter = require('./src/modules/auth/routers/authRouter');
const videoRouter = require('./src/modules/video/routers/videoRouter');
const billsRouter = require('./src/modules/bills/routers/billsRouter');
const usersRouter = require('./src/modules/users/routers/usersRouter');
const globalErrorMiddleware = require('./src/middleware/globalErrorMiddleware');

/*Configuracion de dotenv para poder acceder a las variables de entorno.*/
config({path:'.env'});
const PORT = process.env.PORT;
const environment = process.env.NODE_ENV;

/*Se reemplazan los valores en nuestro .env con la clave y el user correspondiente para asi conectarnos a nuestra DB de mongo.
Se le esta asignando a uina variable para asi posteriormente conectarse por medio de mongoose*/
const DB_VIDEOS = process.env.MONGO_DATABASE_VIDEOS.replace(
"<PASSWORD>",
process.env.MONGO_PASSWORD_VIDEOS
).replace("<USER>", process.env.MONGO_USER_VIDEOS);

connect(DB_VIDEOS).then(() => console.log("✓ Conexión a base de datos exitosa"));

/*Se reemplazan los valores en nuestro .env con la clave y el user correspondiente para asi conectarnos a nuestra DB de mongo.
Se le esta asignando a uina variable para asi posteriormente conectarse por medio de mongoose*/
const DB_USERS = process.env.MONGO_DATABASE_USERS.replace(
    "<PASSWORD>",
    process.env.MONGO_PASSWORD_USERS
    ).replace("<USER>", process.env.MONGO_USER_USERS);
    
    connect(DB_USERS).then(() => console.log("✓ Conexión a base de datos exitosa"));
    

/*Configuracion de express para el funcionamiento de la API.*/
/*Se añade morgan para visualizar el uso de la API y .json para transformar todo a JSON*/
const app = express();
app.use(express.json());
app.use(morgan('dev'));

/*Configuracion de los routers para poder acceder a las rutas correspondientes. Se les agrega a nuestra app.*/
app.use("/auth", authRouter);
app.use("/videos", videoRouter);
app.use("/bills", billsRouter);
app.use("/users", usersRouter);

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