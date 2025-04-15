/*Importes base para el funcionamiento de la API*/
const express = require('express');
const morgan = require('morgan');
const { config } = require('dotenv');

/*Importes de los routers para asi poder acceder correctamente a las rutas correspondientes.*/
const authRouter = require('./src/modules/auth/routers/authRouter');
const videoRouter = require('./src/modules/video/routers/videoRouter');
const billsRouter = require('./src/modules/bills/routers/billsRouter');
const usersRouter = require('./src/modules/users/routers/usersRouter');

/*Configuracion de dotenv para poder acceder a las variables de entorno.*/
config({path:'.env'});
const PORT = process.env.PORT;
const environment = process.env.NODE_ENV;

/*Configuracion de express para el funcionamiento de la API.*/
/*Se añade morgan para visualizar el uso de la API y .json para transformar todo a JSON*/
const app = express();
app.use(express.json());
app.use(morgan('dev'));

/*Ruta base*/
app.get('/', (req, res) => {
    res.status(200).send("OK");
});

/*Configuracion de los routers para poder acceder a las rutas correspondientes. Se les agrega a nuestra app.*/
app.use("/auth", authRouter);
app.use("/videos", videoRouter);
app.use("/bills", billsRouter);
app.use("/users", usersRouter);

/*Configuracion de la API para que escuche en el puerto correspondiente y se le asigna el entorno.
Esto ademas sirve para ver el estado de la API en la consola.*/
app.listen(PORT,()=> {
    console.log(`Entorno: ${environment}`);
    console.log(`Puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});