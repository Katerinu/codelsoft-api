/*Metodo de prueba*/
const authCheck = (req, res) => {
    res.status(200).send("OK Auth Check");
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
module.exports = { authCheck };