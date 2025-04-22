import { PrismaClient } from '../../../../prisma-auth-database/auth-client/index.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { generateTokenJWT, verifyTokenJWT} from '../../../utils/tokenGenerator.js';
import { syncPasswordUpdate } from '../../users/controllers/usersController.js';
import dayjs from 'dayjs';
dotenv.config();

const prisma = new PrismaClient();

const authCheck = (req, res) => {
    res.status(200).send("OK Auth Check");
}


const syncUserCreation = async (user) => {
    try {
        const userCheck = await prisma.user.findFirst({
            where: {
                uuid: user.uuid,
            },
        });
        if (!userCheck) {
            const newUser = await prisma.user.create({
                data: {
                    uuid: user.uuid,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    status: user.status,
                    role: user.role,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const syncUserUpdate = async (user, uuid) => {
    try {
        const userCheck = await prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (userCheck) {
            const updatedUser = await prisma.user.update({
                where: { uuid: uuid },
                data: {
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    updated_at: user.updated_at,
                },
            });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const syncUserDelete = async (uuid) => {
    try {
        const userCheck = await prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (userCheck) {
            const deletedUser = await prisma.user.update({
                where: { uuid: uuid },
                data: {
                    status: "Inactive",
                },
            });
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "Falta el campo email o password" });
    }

    if(email === undefined || password === undefined) {
        return res.status(400).json({ message: "Falta el campo email o password" });
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(401).json({ message: "Alguno de los campos es incorrecto." });
    }

    if (user.status === "Inactive") {
        return res.status(401).json({ message: "Usuario inactivo. Pongase en contacto con un administrador." });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Alguno de los campos es incorrecto." });
    }

    const userForToken = {
        uuid: user.uuid,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
    
    const generatedToken = generateTokenJWT(userForToken);

    res.status(200).json({ user: userForToken, token: generatedToken });
}

const updatePassword = async (req, res) => {
    const { current_password, new_password, password_confirmation } = req.body;
    const { uuid } = req.params;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token inválido" });
    }

    if(decodedToken.user.uuid !== uuid) {
        return res.status(401).json({ message: "No tiene permiso para cambiar la contraseña de este usuario." });
    }

    if (!current_password || !new_password || !password_confirmation) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
    }
    if (current_password === undefined || new_password === undefined || password_confirmation === undefined) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    const user = await prisma.user.findFirst({
        where: {
            uuid: uuid,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.status === "Inactive") {
        return res.status(401).json({ message: "Usuario inactivo. Pongase en contacto con un administrador." });
    }

    const isMatch = await bcrypt.compareSync(current_password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "La contraseña actual es incorrecta." });
    }

    if (new_password !== password_confirmation) {
        return res.status(401).json({ message: "Las contraseñas no coinciden." });
    }

    if(current_password === new_password) {
        return res.status(401).json({ message: "La nueva contraseña no puede ser igual a la actual." });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const updatedUser = await prisma.user.update({
        where: { uuid: uuid },
        data: {
            password: hashedPassword,
            updated_at: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
        },
    });
    if (!updatedUser) {
        return res.status(500).json({ message: "Error al actualizar la contraseña." });
    }

    const syncResult = await syncPasswordUpdate(uuid, hashedPassword);
    if (!syncResult) {
        return res.status(500).json({ message: "Error al sincronizar la contraseña." });
    }

    res.status(200).json({ message: "Contraseña actualizada correctamente." });

}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { authCheck, login ,updatePassword, syncUserCreation, syncUserUpdate, syncUserDelete };