import axios, { AxiosError } from "axios";

import type { Product, ProductBody, User, UserRole } from "./types/app.js";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const originalRequest = error.config!;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                const response = await api.refresh(refreshToken!);

                localStorage.setItem("accessToken", response.access_token);
                localStorage.setItem("refreshToken", response.refresh_token);

                return apiClient(originalRequest);
            } catch (error) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    },
);

interface InfoResponse {
    message: string;
}

interface CreateProductResponse extends InfoResponse {
    product: Product;
}

export const api = {
    createProduct: async (product: ProductBody) => {
        let response = await apiClient.post<CreateProductResponse>("/products", product);
        return response.data;
    },
    getProducts: async () => {
        let response = await apiClient.get<{
            products: Product[];
        }>("/products");
        return response.data;
    },
    getProductById: async (id: string) => {
        let response = await apiClient.get<{
            product: Product;
        }>(`/products/${id}`);
        return response.data;
    },
    updateProduct: async (id: string, product: ProductBody) => {
        let response = await apiClient.patch<InfoResponse>(`/products/${id}`, product);
        return response.data;
    },
    deleteProduct: async (id: string) => {
        let response = await apiClient.delete<InfoResponse>(`/products/${id}`);
        return response.data;
    },

    login: async (email: string, password: string) => {
        let response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
        }>("/auth/login", { email, password });
        return response.data;
    },
    register: async (email: string, password: string, firstName: string, lastName: string) => {
        let response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
        }>("/auth/register", { email, password, first_name: firstName, last_name: lastName });
        return response.data;
    },

    refresh: async (token: string) => {
        let response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
        }>("/auth/refresh", {
            refresh_token: token,
        });
        return response.data;
    },

    getMe: async () => {
        let response = await apiClient.get<{
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: UserRole;
                is_blocked: boolean;
            };
        }>("/users/me");
        return response.data;
    },
    getUser: async (userId: string) => {
        let response = await apiClient.get<{
            user: User;
        }>(`/users/${userId}`);
        return response.data;
    },
    getUsers: async () => {
        let response = await apiClient.get<{
            users: User[];
        }>("/users");
        return response.data;
    },
    blockUser: async (userId: string) => {
        let response = await apiClient.post<InfoResponse>(`/users/${userId}/block`);
        return response.data;
    },
    updateUser: async (userId: string, data: Partial<User>) => {
        let response = await apiClient.patch<InfoResponse>(`/users/${userId}`, data);
        return response.data;
    },
};
