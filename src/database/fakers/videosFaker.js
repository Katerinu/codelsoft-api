import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const generateFakeVideo = () => {
    const video = {
        uuid: uuidv4(),
        title: faker.music.songName(),
        description: faker.lorem.paragraph(),
        genre: faker.helpers.arrayElement([
            "Action", "Comedy", "Drama", "Horror", 
            "Sci-Fi", "Documentary", "Adventure", "Romance"
        ]),
        deleted: faker.datatype.boolean(0.1) // 10% chance de ser eliminado
    };
    
    return video;
}

export { generateFakeVideo };
