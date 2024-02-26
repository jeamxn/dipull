import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// access Token 발급
const sign = async (userId: string) => {
  return new jose.SignJWT({
    id: userId,
  })
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
      userId: result.payload.id,
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