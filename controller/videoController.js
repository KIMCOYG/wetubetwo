import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try{
    const videos = await Video.find({}).sort({_id: -1}); //-1은 위아래 순서를 바꾸고자 함
    res.render("home", { pageTitle: "Home", videos });
  } catch(error){
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
    const {
      query: { term: searchingBy }
    } = req;
    let videos = [];
    try{
      videos = await Video.find({
        title: {$regex: searchingBy, $options: "i"} //정규표현식, 옵션 i는 대소문자 구분 안한다는 것
      });
    } catch(error){
      console.log(error);
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};
  
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
  
  export const postUpload = async (req, res) => {
    const {
      body: {title, description},
      file: {path} //file의 path 부분을 사용
    } = req;
    const newVideo = await Video.create({ //디비에 들어갈 때마다 자동적으로 id가 생성
      fileUrl: path,
      title,
      description,
      creator: req.user.id
    });
    req.user.videos.push(newVideo.id); //몽고디비 안 해당 유저에게 비디오 id 푸시
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: {id}
  } = req;

  try {
    const video = await Video.findById(id).populate("creator"); //populate 객채를 불러오는 함수 오직 objectID 타입에만 사용 가능
    // console.log(video);
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch(error){
    console.log(error);
    res.redirect(routes.home);
  }
}

export const getEditVideo = async (req, res) => { //크리에이터 id, 로그인 id가 다르면 edit 할 수 없어야 함
  const {
    params: {id} //파라미터
  } = req;
  try{
    const video = await Video.findById(id);
    if(video.creator !== req.user.id){ //creator도 id
      throw Error(); //try 내에서 에러 발생 시 자동으로 catch로 이동
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video});
    }
  } catch(error){
    res.redirect(routes.home);
  }

}

export const postEditVideo = async (req, res) => {
  const {
    params: {id},
    body: {title, description}
  } =req;
  try{
    await Video.findOneAndUpdate({ _id: id }, {title, description}); //_id는 몽구스 규칙
    res.redirect(routes.videoDetail(id));
  } catch(error){
    res.redirect(routes.home);
  }
}

export const deleteVideo = async (req, res) =>{
  const {
    params: {id}
  } = req;
  try{
    const video = await Video.findById(id);
    if(video.creator !== req.user.id){
      throw Error();
    } else{
      await Video.findOneAndRemove({_id: id});
    }
  } catch(error){
    console.log(error);
  }
  res.redirect(routes.home)
}

export const postRegisterView = async (req, res) => {
  const{
    params: {id}
  } = req;
  try{
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch(error){
    res.status(400);
  } finally{
    res.end();
  }
};

