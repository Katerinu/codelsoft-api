/*Metodo de prueba*/
const videoCheck = (req, res) => {
    res.status(200).send("OK Video Check");
};
/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { videoCheck };
