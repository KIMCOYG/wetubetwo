import express from "express";
import morgan from "morgan"; //어디에 접속하는지 알게 해줌 (ex)접속 상태 404
import helmet from "helmet"; //보안
import bodyParser from "body-parser"; //form 정보를 req Obj에서 가져오기 위함
import cookieParser from "cookie-parser"; //session을 다루기 위함
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true})); //html form
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;