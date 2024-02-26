import axios from "axios";

import { verify } from "./jwt";

// axios 인스턴스를 생성
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REDIRECT_URI,
  withCredentials: false,
  headers: {
  }
});

// axios 요청 인터셉터
instance.interceptors.request.use(async (config) => {
  try{
    // 로컬 스토리지에 저장된 accessToken 가져오기
    let accessToken = localStorage.getItem("accessToken") || "";

    // accessToken 유효성 검사
    if(!(await verify(accessToken)).ok) {
      // 만료된 accessToken이면 refresh 요청
      const refresh = await axios.get(`${process.env.NEXT_PUBLIC_REDIRECT_URI}/auth/refresh`);
      accessToken = refresh.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
    }
    
    // 헤더에 accessToken 추가
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  }
  catch(e){
    // 에러 발생 시 로그인 페이지로 이동
    window.location.href = "/login";
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

export default instance;