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
      description
    });
    console.log(newVideo);
    // To Do: Upload and save video
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: {id}
  } = req;

  try {
    const video = await Video.findById(id);
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch(error){
    console.log(error);
    res.redirect(routes.home);
  }
}

export const getEditVideo = async (req, res) => {
  const {
    params: {id} //파라미터
  } = req;
  try{
    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video});
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
    await Video.findOneAndRemove({_id: id});
  } catch(error){
    
  }
  res.redirect(routes.home)
}