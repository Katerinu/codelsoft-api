import { verifyTokenJWT} from "../../../utils/tokenGenerator.js";
import { connect } from "mongoose";
import { Video } from "../../../database/models/video/videoModel.js";


const connectMongoose = async () => {
    const DB_VIDEOS = process.env.MONGO_DATABASE_VIDEOS.replace(
    "<PASSWORD>",
    process.env.MONGO_PASSWORD_VIDEOS
    ).replace("<USER>", process.env.MONGO_USER_VIDEOS);
    connect(DB_VIDEOS).then(() => console.log("✓ Conexión a base de datos VIDEOS exitosa"));
}
/*Metodo de prueba*/
const videoCheck = (req, res) => {
    res.status(200).send("OK Video Check");
};

const uploadVideo = async (req, res) => {
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
    const { title, description, genre } = req.body;
    // Verifica si se han proporcionado todos los datos necesarios
    console.log(title, description, genre);
    if (!title || !description || !genre) {
        return res.status(400).json({ message: "Faltan datos para crear el video" });
    }
    const newVideo = await Video.create({
            title,
            description,
            genre
    });
    res.status(201).json({ message: "Video creado", data: newVideo });
}

const getVideoById = async (req, res) => {
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

    const { id } = req.params;
    const video = await Video.findOne({uuid:id});
    if (decodedToken.user.role == "Administrador") {
        res.status(200).json({ message: "Video encontrado", data: video });
    }
    if (!video || video.deleted) {
        return res.status(404).json({ message: "Video no encontrado o eliminado" });
    }
    
    res.status(200).json({ message: "Video encontrado", data: video });
}

const updateVideo = async (req, res) => {
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

    const { title, description, genre } = req.body;
    const { id } = req.params;
    // Verifica si se ingresó el ID de la factura
    if (!id) {
        return res.status(400).json({ message: "Falta el ID de la factura" });
    }
    // Verifica si se han proporcionado todos los datos necesarios
    if (!title || !description || !genre) {
        return res.status(400).json({ message: "Faltan datos para crear el video" });
    }
    const video = await Video.findOneAndUpdate (
        { uuid: id },
        {
          title,
          description,
          genre,
        },
        { new: true }
      );
    if (!video || video.deleted) {
        return res.status(404).json({ message: "Video no encontrado o eliminado"  });
    }
    res.status(200).json({ message: "Video actualizado", data: {title, description, genre} });
}

const deleteVideo = async (req, res) => {
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

    const { id } = req.params;
    // Verifica si se ingresó el ID de la factura
    if (!id) {
        return res.status(400).json({ message: "Falta el ID de la factura" });
    }

    const video = await Video.findOne({ uuid: id });
    if (!video || video.deleted) {
        return res.status(404).json({ message: "Video no encontrado o eliminado" });
    }
    
    await Video.findOneAndUpdate (
        { uuid: id },
        { deleted: true },
      );
    res.status(200).json();
}

const getVideos = async (req, res) => {
    
    const { title, genre } = req.query;
    
    // Construir el filtro de búsqueda
    const filter = { deleted: false };
    
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }
    
    if (genre) {
        filter.genre = { $regex: genre, $options: 'i' };
    }
    
    const videos = await Video.find(filter);
    
    res.status(200).json({ message: "Videos encontrados", data: videos });
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { videoCheck, uploadVideo, getVideoById,
        updateVideo ,connectMongoose, deleteVideo,
        getVideos };
