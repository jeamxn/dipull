import axios from "axios";

// axios 인스턴스를 생성
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URI,
  withCredentials: false,
  headers: {
  }
});

// axios 요청 인터셉터
instance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
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
      const refresh = await axios.get(`${process.env.NEXT_PUBLIC_APP_URI}/auth/refresh`);
      const accessToken = refresh.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      error.config.headers.Authorization = `Bearer ${accessToken}`;
      const originalResponse = await axios.request(error.config);
      return originalResponse.data.data;
    }
    return Promise.reject(error);
  }
);

export default instance;