import express from "express";
import routes from "../routes";
import { videoDetail, deleteVideo, getUpload, postUpload, getEditVideo, postEditVideo } from "../controller/videoController";
import { uploadVideo } from "../middlewares";

const videoRouter = express.Router();

//Upload
videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload); //file URL 반환 미들웨어

//Video Detail
videoRouter.get(routes.videoDetail(), videoDetail);

//Edit Video
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);

//Delete Video
videoRouter.get(routes.deleteVideo(), deleteVideo);

export default videoRouter;