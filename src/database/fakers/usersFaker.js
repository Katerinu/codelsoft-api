import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
const generateFakeUser = async () => {
    const name = faker.person.firstName();
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(name, salt);

    const rol = faker.helpers.arrayElement(
        ["Administrador","Cliente"],
        faker.number.int({ min: 1, max: Math.min(1) })
    );
    const user = {
        uuid: uuidv4(),
        email: faker.internet.email(),
        password: password,
        name: name,
        lastname: faker.person.lastName(),
        created_at: dayjs(faker.date.past()).format("YYYY-MM-DDTHH:mm:ssZ"),
        updated_at: dayjs(faker.date.recent()).format("YYYY-MM-DDTHH:mm:ssZ"),
        role: rol,
        status: faker.helpers.arrayElement(
            ["Active", "Inactive"],
            faker.number.int({ min: 1, max: Math.min(1) })
        ),
    };
    
    return user;
}

export { generateFakeUser };