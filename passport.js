import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy()); //한 문장으로 로컬 passport 완성, document 보기

//사용자 인증 처리 //passportLocalMongoose 때문
passport.serializeUser(User.serializeUser()); //serializeUser user.id를 가짐, 쿠키에 오직 user.id만 담아서 보냄
passport.deserializeUser(User.deserializeUser()); //deserializeUser 어느 사용자인지 어떻게 찾는가
