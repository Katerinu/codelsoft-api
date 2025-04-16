/*Metodo de prueba*/
const billsCheck = (req, res) => {
    res.status(200).send("OK Bills Check");
}
/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { billsCheck };
