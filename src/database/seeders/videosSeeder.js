import { connectMongoose } from "../../modules/video/controllers/videoController.js";
import { generateFakeVideo } from "../fakers/videosFaker.js";
import { Video } from "../models/video/videoModel.js";
import mongoose from "mongoose";

await connectMongoose();

const seedVideos = async (numVideos) => {
    const videos = [];
    const successfulVideos = [];

    for (let i = 0; i < numVideos; i++) {
        const video = generateFakeVideo();
        videos.push(video);
    }

    console.log(`Generados ${videos.length} videos falsos. Ahora insertando en la base de datos...`);

    for (const video of videos) {
        const createdVideo = await createFakeVideo(video);
        if (createdVideo) {
            successfulVideos.push(video);
        } else {
            console.log("Error al crear un video, continuando con otros");
        }
    }
    
    console.log(`Creados exitosamente ${successfulVideos.length} de ${videos.length} videos`);
    return successfulVideos.length > 0 ? successfulVideos : false;
};

const createFakeVideo = async (video) => {
    const { uuid, title, description, genre, deleted } = video;

    try {
        const videoModel = new Video({
            uuid,
            title,
            description,
            genre,
            deleted
        });
        
        const videoCreated = await videoModel.save();
        return videoCreated;
    } catch (error) {
        console.error("Error al crear video:", error);
        return false;
    }
};

export { seedVideos };
