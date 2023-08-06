const required = (
  value: string | undefined,
) => {
  if(!value) throw new Error(`Missing required environment variable ${value}`);
  return value;
};

export const MONGODB_URI = required(process.env?.MONGODB_URI);
export const KAKAO_REDIRECT_URI = required(process.env?.KAKAO_REDIRECT_URI);
export const KAKAO_REST_API_KEY = required(process.env?.KAKAO_REST_API_KEY);
