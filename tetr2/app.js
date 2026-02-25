const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: "Ноутбук", price: 75000 },
  { id: 2, name: "Мышь", price: 1500 },
  { id: 3, name: "Клавиатура", price: 3500 },
];
//Просмотр всех товаров
app.get("/items", (req, res) => {
  res.json(items);
});
//Просмотр товара по ID
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = items.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }
  res.json(product);
});
//Добавление товара
app.post("/items", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Необходимо указать название и стоимость товара" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Стоимость должна быть положительным числом" });
  }
  const newProduct = {
    id: items.length + 1,
    name,
    price,
  };
  items.push(newProduct);
  res.status(201).json(newProduct);
});
//Редактирование товара по айди
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }
  const productIndex = items.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }
  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Необходимо указать название и стоимость товара" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Стоимость должна быть положительным числом" });
  }
  items[productIndex] = { id, name, price };
  res.json(items[productIndex]);
});
//Удаление товара
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }
  const productIndex = items.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }
  const deletedProduct = items.splice(productIndex, 1)[0];
  res.json({
    message: "Товар успешно удален",
    deletedProduct,
  });
});
//Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}/items`);
});
