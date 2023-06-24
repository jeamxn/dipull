const { default: axios } = require("axios");

const loginCheck = async (setMyInfo, router) => {
  const noPermission = () => {
    setMyInfo(false);
    router.push("/login");
  };
  try{
    const { data } = await axios.get("/api/userInfo");
    if(!data || !data.gender || !data.number || !data.name) {
      noPermission();
      return;
    }
    setMyInfo(data);
  }
  catch{
    noPermission();
    return;
  }
};

export default loginCheck;