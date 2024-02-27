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
    const result = await jose.jwtVerify(token, secret);
    return {
      ok: true,
      userId: result.payload.id as UserData["id"],
      payload: result.payload as UserData,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

// refresh Token 발급
const refresh = async (userId: string) => {
  return new jose.SignJWT({
    id: userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("14d")
    .sign(secret);
};

export { sign, verify, refresh };