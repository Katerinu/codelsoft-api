/*Metodo de prueba*/
const usersCheck = (req, res) => {
    res.status(200).send("OK Users Check");
};
/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { usersCheck };
