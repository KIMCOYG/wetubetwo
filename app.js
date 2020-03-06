import express from "express";
import morgan from "morgan"; //어디에 접속하는지 알게 해줌 (ex)접속 상태 404
import helmet from "helmet"; //보안
import cookieParser from "cookie-parser"; //session을 다루기 위함
import bodyParser from "body-parser"; //form 정보를 req Obj에서 가져오기 위함
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

const app = express();

app.use(helmet());
app.set("view engine", "pug");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //html form
app.use(morgan("dev"));
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;