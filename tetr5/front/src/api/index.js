import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export const api = {
  // Получить все товары
  getItems: async () => {
    const response = await apiClient.get("/items");
    return response.data;
  },

  // Получить товар по id
  getProductById: async (id) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  // Создать товар
  createProduct: async (product) => {
    const response = await apiClient.post("/items", product);
    return response.data;
  },

  // Обновить товар
  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/items/${id}`, product);
    return response.data;
  },

  // Удалить товар
  deleteProduct: async (id) => {
    await apiClient.delete(`/items/${id}`);
  },
};
