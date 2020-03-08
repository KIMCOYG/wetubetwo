import express from "express";
import routes from "../routes";
import { home, search } from "../controller/videoController";
import { logout, getJoin, postJoin, getLogin, postLogin, githubLogin, postGithubLogin } from "../controller/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";
import passport from "passport";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin); //패스워드 맞는지 체크하는 미들웨어 postJoin

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin)

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin);

globalRouter.get(
    routes.githubCallback, 
    passport.authenticate("github", {failureRedirect: routes.login}),
    postGithubLogin  
);

export default globalRouter;