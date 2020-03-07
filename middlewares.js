import multer from "multer"; //file URL 반환
import routes from "./routes";

const multerVideo = multer({dest: "uploads/videos/"}); //폴더 생성

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 1
  };
  next();
};

export const uploadVideo = multerVideo.single("videoFile"); //오직 하나의 파일만 업로드 가능