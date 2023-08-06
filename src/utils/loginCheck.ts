import axios from "axios";
import { NextRouter } from "next/router";

import { MyInfoAtom } from "./states";

const loginCheck = async (
  setMyInfo: Function,
  setIsAdmin: Function,
  router: NextRouter
) => {
  const noPermission = () => {
    setMyInfo(false);
    router.push("/login");
  };
  try{
    const { data }: {
      data: MyInfoAtom,
    } = await axios.get("/api/userInfo");
    if(!data || !data.gender || !data.number || !data.name) {
      noPermission();
      return;
    }
    setMyInfo(data);
    setIsAdmin(Boolean(data.admin));
  }
  catch{
    noPermission();
    return;
  }
};

export default loginCheck;