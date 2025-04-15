const express = require('express');
const morgan = require('morgan');
const authRouter = require('./src/modules/auth/routers/authRouter');
const videoRouter = require('./src/modules/video/routers/videoRouter');
const billsRouter = require('./src/modules/bills/routers/billsRouter');
const usersRouter = require('./src/modules/users/routers/usersRouter');


const PORT = 3000;
const environment = 'Desarrollo';

const app = express();

app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.status(200).send("OK");
});

app.use("/auth", authRouter);
app.use("/videos", videoRouter);
app.use("/bills", billsRouter);
app.use("/users", usersRouter);

app.listen(PORT,()=> {
    console.log(`Entorno: ${environment}`);
    console.log(`Puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
});