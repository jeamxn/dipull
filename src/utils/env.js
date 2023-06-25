const required = (value) => {
  if(!value) throw new Error(`Missing required environment variable ${value}`);
  return value;
};

export const MOGODB_URL = required(process.env?.MOGODB_URL);
export const KAKAO_REDIRECT_URI = required(process.env?.KAKAO_REDIRECT_URI);
export const KAKAO_REST_API_KEY = required(process.env?.KAKAO_REST_API_KEY);
