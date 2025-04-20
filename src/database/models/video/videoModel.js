import { v4 as uuidv4 } from 'uuid';
import { Schema, model } from 'mongoose';

const VideoSchema = new Schema({
    uuid: {
        type: String,
        inmutable: true,
        default: () => uuidv4(),
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Video = model("Video", VideoSchema);

export {
    Video
}