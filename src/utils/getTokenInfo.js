import axios from "axios";

import verifiedToken from "./verifiedToken";

const getTokenInfo = async (req, res) => {
  const data = await verifiedToken(req, res);
  const { success, access_token } = data;

  if(!success) return;

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