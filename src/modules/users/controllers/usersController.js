import bcrypt from "bcryptjs";
import { generateTokenJWT, verifyTokenJWT} from "../../../utils/tokenGenerator.js";
import { getDocument, createDocument, updateDocument, getCollection} from "../../../utils/mongoORM.js";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";
import { syncUserCreation, syncUserUpdate, syncUserDelete } from "../../auth/controllers/authController.js";

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
        status: "Active",
        role: role,
        created_at: date,
        updated_at: date,
    };

    const sync = await syncUserCreation(user);
    
    if (!sync) {
        console.log("Error al sincronizar el usuario con la base de datos externa");
        return res.status(500).json({ message: "Error al crear el usuario" });
    }

    const createdUser = await createDocument(user, "Users");

    if (!createdUser) {
        console.log("Error al crear el usuario en la base de datos local");
        await syncUserDelete(uuid);
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
    const { uuid } = req.params;
    const token = req.headers.authorization;

    if (!uuid) {
        return res.status(400).json({ message: "Falta el uuid del usuario a buscar" });
    }
    if (!token) {
        return res.status(401).json({ message: "Se requiere un token de inicio de sesión" });
    }

    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if (decodedToken.user.uuid !== uuid) {
        if (decodedToken.user.role !== "Administrador") {
            return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
        }
    }

    try {
        const user = await getDocument("Users", { uuid: uuid });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if(user.status !== "Active"){
            return res.status(403).json({ message: "No se ha encontrado al usuario." });
        }

        const userToSend = {
            uuid: user.uuid,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
        res.status(200).json({ user: userToSend });
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

const updateUser = async (req, res) => {
    const { uuid } = req.params;
    const token = req.headers.authorization;

    const { name, lastname, email, password  } = req.body;

    if(password !== undefined){
        return res.status(400).json({ message: "No se puede actualizar la contraseña aqui" });
    }

    if (!uuid) {
        return res.status(400).json({ message: "Falta el uuid del usuario a buscar" });
    }
    if (!token) {
        return res.status(401).json({ message: "Se requiere un token de inicio de sesión" });
    }


    const searched_user = await getDocument("Users", { uuid: uuid });
    if (!searched_user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if(searched_user.status !== "Active"){
        return res.status(403).json({ message: "No se ha encontrado al usuario." });
    }

    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if (decodedToken.user.uuid !== uuid) {
        if (decodedToken.user.role !== "Administrador") {
            return res.status(403).json({ message: "No tienes permiso para ver este usuario" });
        }
    }

    let userName = searched_user.name;
    let userLastname = searched_user.lastname;
    let userEmail = searched_user.email;
    let updated_at = searched_user.updated_at;

    if(name !== undefined) {
        userName = name;
    }
    if(lastname !== undefined) {
        userLastname = lastname;
    }
    if(email !== undefined) {
        userEmail = email;
    }

    if(name !== undefined || lastname !== undefined || email !== undefined) {
        updated_at = dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
    }

    const user = {
        name: userName,
        lastname: userLastname,
        email: userEmail,
        updated_at: updated_at,
    };

    const sync = await syncUserUpdate(user, uuid);
    if (!sync) {
        return res.status(500).json({ message: "Error al actualizar el usuario" });
    }

    const update_user = await updateDocument(user, "Users", { uuid: uuid });
    if (!update_user) {
        return res.status(500).json({ message: "Error al actualizar el usuario" });
    }

    return res.status(200).json({ message: "Usuario actualizado correctamente", user: user });
}

const deleteUser = async (req, res) => {
    const { uuid } = req.params;
    const token = req.headers.authorization;

    if (!uuid) {
        return res.status(400).json({ message: "Falta el uuid del usuario a eliminar" });
    }
    if (!token) {
        return res.status(401).json({ message: "Se requiere un token de inicio de sesión" });
    }

    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if (decodedToken.user.role !== "Administrador") {
        return res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });
    }

    const searched_user = await getDocument("Users", { uuid: uuid });
    if (!searched_user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if(searched_user.status !== "Active"){
        return res.status(403).json({ message: "No se ha encontrado al usuario." });
    }

    const sync = await syncUserDelete(uuid);
    if (!sync) {
        return res.status(500).json({ message: "Error al eliminar el usuario" });
    }

    const status = {
        status: "Inactive",
    }

    const deleted_user = await updateDocument(status, "Users", { uuid: uuid });

    if (!deleted_user) {
        return res.status(500).json({ message: "Error al eliminar el usuario" });
    }

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
}

const getAllUsers = async (req, res) => {
    const token = req.headers.authorization;
    const { email, name, lastname } = req.query;

    if (!token) {
        return res.status(401).json({ message: "Se requiere un token de inicio de sesión" });
    }

    const decodedToken = verifyTokenJWT(token);

    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if (decodedToken.user.role !== "Administrador") {
        return res.status(403).json({ message: "No tienes permiso para ver todos los usuarios" });
    }

    const users = await getCollection("Users");
    if (!users) {
        return res.status(500).json({ message: "Error al obtener los usuarios" });
    }

    const filteredUsers = users.filter((user) => {
        if (user.status !== "Active") return false;
        if (email && user.email !== email) return false;
        if (name && user.name !== name) return false;
        if (lastname && user.lastname !== lastname) return false;
        return true;
    });

    const usersToSend = filteredUsers.map((user) => {
        return {
            uuid: user.uuid,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        };
    });

    return res.status(200).json({ users: usersToSend });
}

const syncPasswordUpdate = async (uuid, new_password_hashed) => {
    const searched_user = await getDocument("Users", { uuid: uuid });
    if (!searched_user) {
        return false;
    }

    const update_user = await updateDocument({ password: new_password_hashed }, "Users", { uuid: uuid });
    if (!update_user) {
        return false;
    }

    return true;
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { 
    usersCheck, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getAllUsers ,
    syncPasswordUpdate
};