import axios from "axios";
import { serialize } from "cookie";

import * as env from "@/utils/env";

const verifiedToken = async (req, res) => {
  const { access_token, refresh_token } = req.cookies;

  if (!access_token || !refresh_token) {
    res.status(401).json({ message: "토큰이 없습니다." });
    return {
      success: false,
      message: "no token"
    };
  }

  const tryNew = async () => {
    const { data: newTokenInfo } = await axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: {
        grant_type: "refresh_token",
        client_id: env.KAKAO_REST_API_KEY,
        refresh_token: refresh_token,
      },
    });

    const { data: newTokenInfo2 } = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v1/user/access_token_info",
      headers: {
        Authorization: `Bearer ${newTokenInfo.access_token}`,
      },
    });

    if (newTokenInfo2.expiresInMillis < 0) {
      res.status(401).json({ message: "토큰이 만료되었습니다." });
      return {
        success: false,
        message: "token expired"
      };
    }
		
    const c_access_token = serialize("access_token", newTokenInfo.access_token, {
      path: "/",
      expires: new Date(newTokenInfo.expires_in * 1000 + Date.now()),
    });
	
    res.setHeader("Set-Cookie", [
      c_access_token
    ]);

    return {
      success: true,
      reload: true,
      access_token: newTokenInfo.access_token,
      refresh_token: refresh_token,
    };
  };

  try{
    const { data: tokenInfo } = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v1/user/access_token_info",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    // console.log(tokenInfo);
    if (tokenInfo.expiresInMillis < 0) {
      const data = await tryNew();
      if(data.success) {
        return data;
      }
      else {
        return {
          success: false,
          message: "token failed"
        };
      }
    }
    else 
      return {
        success: true,
        access_token, refresh_token
      };
  }
  catch {
    const data = await tryNew();
    if(data.success) {
      return data;
    }
    else 
      return {
        success: false,
        message: "token failed"
      };
  }
};

export default verifiedToken;