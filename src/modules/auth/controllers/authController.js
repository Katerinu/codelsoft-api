import { PrismaClient } from '../../../../prisma-auth-database/auth-client/index.js';

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

const login = (req, res) => {
    res.status(200).send("OK Login Check");
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { authCheck, login , syncUserCreation, syncUserUpdate, syncUserDelete };