import express from "express";
import morgan from "morgan"; //어디에 접속하는지 알게 해줌 (ex)접속 상태 404
import helmet from "helmet"; //보안
import cookieParser from "cookie-parser"; //session을 다루기 위함
import bodyParser from "body-parser"; //form 정보를 req Obj에서 가져오기 위함
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

import "./passport";

const app = express();

const CokieStore = MongoStore(session);

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static")); //static으로 가려고 하면 static 폴더를 보게 함
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //html form
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({mongooseConnection: mongoose.connection}) //몽구스는 이 저장소를 디비에 연결해줌, 로그인 유지
}));
app.use(passport.initialize());
app.use(passport.session()); //use.req 생성
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;