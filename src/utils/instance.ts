import axios from "axios";

// axios 인스턴스를 생성
const instance = axios.create({
  withCredentials: false,
  headers: {}
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
      try{
        const refresh = await axios.get("/auth/refresh");
        const accessToken = refresh.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        const originalResponse = await axios.request(error.config);
        return originalResponse.data.data;
      }
      catch (e: any) {
        if(e.response.status === 401) {
          await axios.get("/auth/logout", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;