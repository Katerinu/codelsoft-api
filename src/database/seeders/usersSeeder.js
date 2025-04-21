import { connectDB, createDocument, getDocument } from "../../utils/mongoORM.js";
import { generateFakeUser } from "../fakers/usersFaker.js";
import { PrismaClient } from '../../../prisma-auth-database/auth-client/index.js';

const prisma = new PrismaClient();

await connectDB();

const seedUsers = async (numUsers) => {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
        const user = await generateFakeUser();
        users.push(user);
    }

    for (const user of users) {
        const createdUser = await createFakeUsers(user);
        if (!createdUser) {
            console.log("Error al crear el usuario en la base de datos local");
            return false;
        }
    }
    return users;
}

const createFakeUsers = async (user) => {
    const {uuid, name, lastname, email, password, role, status, created_at, updated_at} = user;

    const searched_user = await getDocument("Users", { email: email });

    if (searched_user) {
        console.log("El email ya está en uso");
        return false;
    }

    const userCheck = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    if (userCheck) {
        console.log("El email ya está en uso en la base de datos local");
        return false;
    }

    const userToSave = {
        uuid: uuid,
        name: name,
        lastname: lastname,
        email: email,
        password: password,
        status: status,
        role: role,
        created_at: created_at,
        updated_at: updated_at,
    };
    const createdUser = await createDocument(userToSave, "Users");

    if (!createdUser) {
        console.log("Error al crear el usuario en la base de datos local");
        return false;
    }

    const userCreated = await prisma.user.create({
        data: {
            uuid: uuid,
            name: name,
            lastname: lastname,
            email: email,
            password: password,
            status: status,
            role: role,
            created_at: created_at,
            updated_at: updated_at,
        },
    });

    if (!userCreated) {
        console.log("Error al crear el usuario en la base de datos local");
        return false;
    }


    return true;
}

export { seedUsers };