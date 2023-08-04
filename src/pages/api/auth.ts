import axios from "axios";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/utils/db";
import * as env from "@/utils/env";

const auth = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const {code} = req.query;

  const {data: kakaoTokens} = await axios({
    method: "post",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    data: {
      grant_type: "authorization_code",
      client_id: env.KAKAO_REST_API_KEY,
      redirect_uri: env.KAKAO_REDIRECT_URI,
      code: code,
    },
  });
  const {data} = await axios({
    method: "get",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      "Authorization": `Bearer ${kakaoTokens.access_token}`
    }
  });

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const query = { id: data.id };
  const update = {
    $set: {
      id: Number(data.id),
      nickname: data.properties.nickname,
      profile_image: data.properties.profile_image,
      thumbnail_image: data.properties.thumbnail_image,
    },
  };
  const options = { upsert: true };
  const result = await userCollection.updateOne(query, update, options);

  const user = await userCollection.findOne(query);

  const access_token = serialize("access_token", kakaoTokens.access_token, {
    path: "/",
    expires: new Date(kakaoTokens.expires_in * 1000 + Date.now()),
    // httpOnly: true,
    // secure: true,
  });

  const refresh_token = serialize("refresh_token", kakaoTokens.refresh_token, {
    path: "/",
    expires: new Date(kakaoTokens.refresh_token_expires_in * 1000 + Date.now()),
    // httpOnly: true,
    // secure: true,
  });
  // tokenCheck(kakaoTokens.access_token, kakaoTokens.refresh_token);
  res.setHeader("Set-Cookie", [
    refresh_token,
    access_token
  ]);

  const myInfoData = await userCollection.findOne({ id: user.id });
  if(!myInfoData.gender || !myInfoData.number || !myInfoData.name) {
    res.redirect("/edit");
  }
  else {
    res.redirect("/");
  }
};

export default auth;
