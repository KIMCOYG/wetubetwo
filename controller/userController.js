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
  // console.log(accessToken, refreshToken, profile, cb);
  const { _json: { id, avatar_url: avatarUrl, name, email} } = profile;
  console.log(profile._json);
  try{
    const user = await User.findOne({email});
    if(user){ //사용자가 겹칠 경우
      user.githubId = id;
      user.avatarUrl = avatarUrl;
      user.save();
      return cb(null, user); //쿠키에 저장
    }
    const newUser = await User.create({ //create는 생성 및 저장
      email,
      name,
      githubId: id,
      avatarUrl
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

export const getMe = (req, res) => {
  // console.log(req.user);
  res.render("userDetail", { pageTitle: "User Detail", user: req.user});
}

export const userDetail = async (req, res) => {
  const {
    params: {id}
  } = req;
  try{
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch(error){
    res.redirect(routes.home);
  }
}
  
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
 
export const postEditProfile = async (req, res) => {
  console.log(req.file);
  const {
    body: {name, email},
    file
  } = req;
  try{
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl //유저가 파일을 추가하지 않으면 req.user.avatarUrl
    });
    res.redirect(routes.me);
  } catch(error){
    res.render("editProfile", { pageTitle: "Edit Profile" });
  }
}
export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });