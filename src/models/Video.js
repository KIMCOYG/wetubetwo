import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: "File URL is required",
    },
    title: {
        type: String,
        required: "Title is required"
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment" //다른 디비 가져오기
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //다른 디비 가져오기
    }
});

const model = mongoose.model("Video", VideoSchema);

export default model;