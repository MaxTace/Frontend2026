import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {
            refreshToken: refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const api = {
  register: (userData) =>
    apiClient.post("/api/auth/register", userData).then((res) => res.data),
  login: (credentials) =>
    apiClient.post("/api/auth/login", credentials).then((res) => res.data),
  getMe: () => apiClient.get("/api/auth/me").then((res) => res.data),

  getItems: () => apiClient.get("/items").then((res) => res.data),
  getProductById: (id) => apiClient.get(`/items/${id}`).then((res) => res.data),
  createProduct: (product) =>
    apiClient.post("/items", product).then((res) => res.data),
  updateProduct: (id, product) =>
    apiClient.patch(`/items/${id}`, product).then((res) => res.data),
  deleteProduct: (id) => apiClient.delete(`/items/${id}`),

  getUsers: () => apiClient.get("/api/users").then((res) => res.data),
};
