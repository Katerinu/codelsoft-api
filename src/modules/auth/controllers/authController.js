import { PrismaClient } from '../../../../prisma-auth-database/auth-client/index.js';

const prisma = new PrismaClient();

const authCheck = (req, res) => {
    res.status(200).send("OK Auth Check");
}

const syncUserCreation = async (user) => {

    const userCheck =  await prisma.user.findFirst({
        where: {
            uuid: user.uuid,
        },
    });
    
    if(!userCheck) {
        const newUser = await prisma.user.create({
            data: {
                uuid: user.uuid,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
        });
        return true;
    }
    return false;
}

const login = (req, res) => {
    res.status(200).send("OK Login Check");
}

/*Exporte de todos los metodos correspondientes al controlador para ser usados en nuestro Router.*/
export { authCheck, login , syncUserCreation };