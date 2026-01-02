import axios from "axios";

const BASE_URL = "http://localhost:8088";

const translationApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
});

translationApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

translationApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);
export default translationApi;