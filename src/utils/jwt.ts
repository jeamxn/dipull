import * as jose from "jose";

import { UserData } from "@/app/auth/type";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// access Token 발급
const sign = async (data: {
  id: string;
  data: {
    id: string;
    profile_image: string;
    gender: string;
    name: string;
    number: number;
  }
}) => {
  return new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
};

// access Token 검증
const verify = async (token: string) => {
  try {
    const result = await jose.jwtVerify(token, secret) as unknown as {
      payload: {
        id: string;
        data: UserData;
        iat: number;
      };
    };
    return {
      ok: Boolean(result.payload.id),
      userId: result.payload.id,
      payload: result.payload,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

// refresh Token 발급
const refresh = async (userdata: UserData) => {
  return new jose.SignJWT({
    ...userdata,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("14d")
    .sign(secret);
};
export const refreshVerify = async (token: string) => {
  try {
    const result = await jose.jwtVerify(token, secret) as unknown as {
      payload: UserData;
    };
    const rt: {
      ok: true;
      payload: UserData;
    } = {
      ok: true,
      payload: result.payload,
    };
    return rt;
  } catch (error: any) {
    const rt: {
      ok: false;
      message: string;
    } = {
      ok: false,
      message: error.message,
    };
    return rt;
  }
};

export { sign, verify, refresh };