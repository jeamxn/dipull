import axios from "axios";

import { getCookieClient } from "./getCookieClient";

// axios 인스턴스를 생성
const instance = axios.create({
  withCredentials: false,
  headers: {}
});

// axios 요청 인터셉터
instance.interceptors.request.use(
  async (config) => {
    const accessToken = getCookieClient("accessToken");
    if(accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if(error.response.status === 401) {
      try{
        const refresh = await axios.get("/auth/refresh");
        const accessToken = refresh.data.accessToken;
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        const originalResponse = await axios.request(error.config);
        return originalResponse.data.data;
      }
      catch (e: any) {
        if(e.response.status === 401) {
          await axios.get("/auth/logout", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${getCookieClient("accessToken")}`
            }
          });
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;