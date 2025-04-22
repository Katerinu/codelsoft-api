import { connectDB, createDocument, getDocument, getCollection } from "../../utils/mongoORM.js";
import { generateFakeUser } from "../fakers/usersFaker.js";
import { PrismaClient } from '../../../prisma-auth-database/auth-client/index.js';
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

await connectDB();

const seedUsers = async (numUsers) => {
    await connectDB();
    const users = [];
    const users_in_db = await getCollection("Users");
    console.log("users_in_db: ", users_in_db.length);

    if (users_in_db.length === 0) {
        const salt_admin = await bcrypt.genSalt(10);
        const hashed_adminpassword = await bcrypt.hash("admin", salt_admin);
        const salt_user = await bcrypt.genSalt(10);
        const hashed_userpassword = await bcrypt.hash("user", salt_user);
        const user_admin = {
            uuid: uuidv4(),
            email: "admin@admin.com",
            password: hashed_adminpassword,
            name: "Admin",
            lastname: "Admin Lastname",
            created_at: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
            updated_at: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
            role: "Administrador",
            status: "Active"
        };

        const createdUser = await createFakeUsers(user_admin);
        if (!createdUser) {
            console.log("Error al crear el usuario en la base de datos local");
            return false;
        }
        console.log("Primer administrador creado correctamente en la base de datos local");
        const user_user = {
            uuid: uuidv4(),
            email: "user@user.com",
            password: hashed_userpassword,
            name: "User",
            lastname: "User Lastname",
            created_at: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
            updated_at: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
            role: "Cliente",
            status: "Active"
        };

        const createdUser2 = await createFakeUsers(user_user);
        if (!createdUser2) {
            console.log("Error al crear el usuario en la base de datos local");
            return false;
        }
        console.log("Primer cliente creado correctamente en la base de datos local");
    }

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