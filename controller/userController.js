import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
      try{
        const user = User({
          name,
          email
        });
        await User.register(user, password);
        next();
      } catch(error){
        console.log(error);
        res.redirect(routes.home);
      }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate('local', { //local은 설치해준 strategy 이름, authenticate는 eamil과 passport를 찾아보도록 설정되어있음
  failureRedirect: routes.login,
  successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github")

export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => { //깃헙에서 돌아오는 과정
  const { _json: { id, avatar_url, name, email} } = profile;
  try{
    const user = await User.findOne({email});
    if(user){ //사용자가 겹칠 경우
      user.githubId = id;
      user.save();
      return cb(null, user); //쿠키에 저장
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url
    });
      return cb(null, newUser);
  } catch(error){
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
}

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });
export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });