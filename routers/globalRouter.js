import express from "express";
import routes from "../routes";
import { home, search } from "../controller/videoController";
import { logout, getJoin, postJoin, getLogin, postLogin } from "../controller/userController";

const globalRouter = express.Router();

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin); //패스워드 맞는지 체크하는 미들웨어

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin)

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, logout);

export default globalRouter;