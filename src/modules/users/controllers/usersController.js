import bcrypt from "bcryptjs";
import { generateTokenJWT, verifyTokenJWT} from "../../../utils/tokenGenerator.js";
import { getDocument, createDocument} from "../../../utils/mongoORM.js";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";
import { syncUserCreation } from "../../auth/controllers/authController.js";

/*Metodo de prueba*/
const usersCheck = (req, res) => {
    res.status(200).send("OK Users Check");
};

const createUser = async (req, res) => {
     const { name, lastname, email, password, password_confirmation, role} = req.body;
    
    if (!name || !lastname || !email || !password || !password_confirmation || !role) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if(role !== "Administrador" && role !== "Cliente"){
        return res.status(400).json({ message: "El rol no es válido" });
    }

    if(role === "Administrador"){
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "No se ha proporcionado un token" });
        }
        const decodedToken = verifyTokenJWT(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const userRole = decodedToken.user.role;
        if (userRole !== "Administrador") {
            return res.status(403).json({ message: "No tienes permiso para crear un usuario" });
        }
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const searched_user = await getDocument("Users", { email: email });

    if (searched_user) {
        return res.status(400).json({ message: "El email ya está en uso" });
    }


    const uuid = uuidv4();
    const date = dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
    const user = {
        uuid,
        name,
        lastname,
        email,
        password: hashedPassword,
        role: role,
        created_at: date,
        updated_at: date,
    };

    const createdUser = await createDocument(user, "Users");

    if (!createdUser) {
        return res.status(500).json({ message: "Error al crear el usuario" });
    }

    const sync = await syncUserCreation(user);
    
    if (!sync) {
        return res.status(500).json({ message: "Error al crear el usuario" });
    }

    const userForToken = {
        uuid: uuid,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };

    const generatedToken = generateTokenJWT(userForToken);

    res.status(201).json({ user: userForToken, token: generatedToken });
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization;

    if (!id) {
        return res.status(400).json({ message: "Falta el uuid del usuario a buscar" });
    }
    if (!token) {
        return res.status(401).json({ message: "Se requiere un token de inicio de sesión" });
    }

    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if (decodedToken.user.uuid !== id) {
        if (decodedToken.user.role !== "Administrador") {
            return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
        }
    }

    try {
        const user = await getDocument("Users", { uuid: id });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const searched_role = await getDocument("Roles", { id: user.role });

        const userToSend = {
            uuid: user.uuid,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: searched_role.name,
            role_id: searched_role.id,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        res.status(200).json({ userToSend });
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

const updateUser = (req, res) => {
    res.status(200).send("OK Update User");
}

const deleteUser = (req, res) => {
    res.status(200).send("OK Delete User");
}

const getAllUsers = (req, res) => {
    res.status(200).send("OK Get All Users");
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { 
    usersCheck, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getAllUsers 
};