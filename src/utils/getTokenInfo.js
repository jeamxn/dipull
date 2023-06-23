import axios from "axios";
import { serialize } from "cookie";

import verifiedToken from "./verifiedToken";

import * as env from "@/utils/env";

const getTokenInfo = async (req, res) => {
  const data = await verifiedToken(req, res);
  const { success, access_token } = data;
  // console.log(`start verifiedToken ${success} ${access_token}`);
  // console.log(data);

  if(!success) return;

  // console.log(`end verifiedToken ${access_token}`);
	
  //get userinfo
  const { data: tokenInfo } = await axios({
    method: "get",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return tokenInfo;
};

export default getTokenInfo;