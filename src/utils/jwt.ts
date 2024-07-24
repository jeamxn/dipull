import * as jose from "jose";

import { UserInfo } from "./db/utils";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// access Token 발급
const accessSign = async (data: UserInfo) => {
  return new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
};

// access Token 검증
const accessVerify = async (token: string) => {
  const { payload } = await jose.jwtVerify<UserInfo>(token, secret);
  return payload;
};

// refresh Token 발급
const refreshSign = async (data: UserInfo) => {
  return new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("14d")
    .sign(secret);
};

const refreshVerify = async (token: string) => {
  const { payload } = await jose.jwtVerify<UserInfo>(token, secret);
  return payload;
};

export { accessSign, accessVerify, refreshSign, refreshVerify };