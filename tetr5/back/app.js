const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Товары API',
      version: '1.0.0',
      description: 'API для управления товарами в интернет-магазине',
      contact: {
        name: 'Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальный сервер'
      }
    ],
    components: {
      schemas: {
        Item: {
          type: 'object',
          required: ['name', 'category', 'description', 'price', 'stock'],
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор товара',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Название товара',
              example: 'Игровой ноутбук MSI'
            },
            category: {
              type: 'string',
              description: 'Категория товара',
              example: 'Электроника'
            },
            description: {
              type: 'string',
              description: 'Описание товара',
              example: 'Мощный игровой ноутбук с видеокартой RTX 3060'
            },
            price: {
              type: 'number',
              description: 'Цена товара',
              example: 75000
            },
            stock: {
              type: 'integer',
              description: 'Количество на складе',
              example: 5
            },
            rating: {
              type: 'number',
              description: 'Рейтинг товара (0-5)',
              example: 4.8
            },
            image: {
              type: 'string',
              description: 'URL изображения товара',
              example: 'https://example.com/images/msi-laptop.jpg'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Сообщение об ошибке'
            }
          }
        },
        DeleteResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Товар успешно удален'
            },
            deletedProduct: {
              $ref: '#/components/schemas/Item'
            }
          }
        }
      }
    }
  },
  apis: ['./server.js'], // Путь к файлу с аннотациями
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let items = [
  {
    id: 1,
    name: "Игровой ноутбук MSI",
    category: "Электроника",
    description:
      "Мощный игровой ноутбук с видеокартой RTX 3060, процессором Intel Core i7 и 16GB RAM",
    price: 75000,
    stock: 5,
    rating: 4.8,
    image: "https://static.insales-cdn.com/images/products/1/5788/894187164/2024-08-11_16-14-11.png",
  },
   {
    id: 2,
    name: "Беспроводная мышь Logitech",
    category: "Электроника",
    description:
      "Эргономичная беспроводная мышь с сенсором 4000 DPI и подсветкой RGB",
    price: 1500,
    stock: 15,
    rating: 4.5,
    image: "https://3logic.ru/pimg/pim/regular/1509793.jpg",
  },
  {
    id: 3,
    name: "Механическая клавиатура",
    category: "Электроника",
    description:
      "Механическая клавиатура с переключателями Cherry MX, подсветкой и металлической основой",
    price: 3500,
    stock: 8,
    rating: 4.7,
    image: "https://redragon.ru/public/o/products/8798/d0de9878.webp",
  },
  {
    id: 4,
    name: "Картофель молодой",
    category: "Продукты",
    description: "Свежий молодой картофель, выращенный без химикатов",
    price: 35,
    stock: 200,
    rating: 4.3,
    image: "https://www.tveragroprom.com/wp-content/uploads/2023/10/nature-plant-field-fruit-food-produce-1334453-pxhere.com_.jpg",
  },
  {
    id: 5,
    name: "Молоко 2.5%",
    category: "Продукты",
    description: "Пастеризованное молоко отборного качества, 1 литр",
    price: 350,
    stock: 45,
    rating: 4.6,
    image: "https://ecomilk.ru/upload/iblock/8d4/7us50mu65vv4ujm5trnkzvzh9vnyvp5z.png",
  },
  {
    id: 6,
    name: "Корм для кошек премиум",
    category: "Зоотовары",
    description: "Сухой корм для кошек с курицей и овощами, 2 кг",
    price: 2000,
    stock: 12,
    rating: 4.9,
    image: "https://katiko.ru/image/cache/catalog/2021/monge/855/70011938-2-1200x1200.jpg",
  },
  {
    id: 7,
    name: "Кукуруза консервированная",
    category: "Продукты",
    description: "Консервированная кукуруза, банка 400 г",
    price: 50,
    stock: 60,
    rating: 4.2,
    image: "https://www.deloks.ru/upload/iblock/8ec/b4m567xupnzqzhyc7lnfp7tzp3clxd7y/kukuruza_bondyuel_konservirovannaya_340_g_1_full.jpg",
  },
  {
    id: 8,
    name: "Торт Медовик",
    category: "Продукты",
    description: "Классический медовый торт с заварным кремом, 1 кг",
    price: 3500,
    stock: 3,
    rating: 5.0,
    image: "https://sedelice.ru/uploads/product/new/mvK_6T2DKvQN.jpg",
  },
  {
    id: 9,
    name: "Шоколадные конфеты Ассорти",
    category: "Продукты",
    description: "Набор шоколадных конфет с разными начинками, 500 г",
    price: 700,
    stock: 25,
    rating: 4.4,
    image: "https://opttorg-horeca.ru/assets/images/catalog/konditerskie-izdeliya/shokoladnye-konfety-assorti-miks-ekstra.jpg",
  },
  {
    id: 10,
    name: "Напиток Добри Кола",
    category: "Напитки",
    description: "Газированный напиток Coca-Cola, 1.5 литра",
    price: 100,
    stock: 50,
    rating: 4.1,
    image: "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/4b/a0/5426a8e1e461aab5e588d424160b.jpg",
  },
  {
    id: 11,
    name: "Наушники Sony",
    category: "Электроника",
    description: "Беспроводные наушники с шумоподавлением и 30 часами работы",
    price: 8900,
    stock: 7,
    rating: 4.8,
    image: "https://image.kazanexpress.ru/crj9b8p1uakkt3hiu200/t_product_high.jpg",
  },
  {
    id: 12,
    name: "Корм для собак",
    category: "Зоотовары",
    description: "Сухой корм для собак мелких пород с ягненком, 3 кг",
    price: 2800,
    stock: 10,
    rating: 4.7,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6c7FVzFr6fsz9-0NfRJYIDxy4gOoeOf-fA&s",
  },
];

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Получить все товары
 *     tags: [Товары]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get("/items", (req, res) => {
  res.json(items);
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о товаре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = items.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Товар не найден" });
  }
  res.json(product);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Товары]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/items", (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name || !category || !description || !price || !stock) {
    return res.status(400).json({
      error:
        "Необходимо указать название, категорию, описание, стоимость и количество на складе",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Стоимость должна быть положительным числом" });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      error: "Количество на складе должно быть неотрицательным числом",
    });
  }

  if (rating && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return res
      .status(400)
      .json({ error: "Рейтинг должен быть числом от 0 до 5" });
  }

  const newProduct = {
    id: items.length + 1,
    name,
    category,
    description,
    price,
    stock,
    rating: rating || 0,
    image: image || null,
  };

  items.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Полностью обновить товар
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, description, price, stock, rating, image } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }

  const productIndex = items.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  if (!name || !category || !description || !price || !stock) {
    return res.status(400).json({
      error:
        "Необходимо указать название, категорию, описание, стоимость и количество на складе",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Стоимость должна быть положительным числом" });
  }

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      error: "Количество на складе должно быть неотрицательным числом",
    });
  }

  if (rating && (typeof rating !== "number" || rating < 0 || rating > 5)) {
    return res
      .status(400)
      .json({ error: "Рейтинг должен быть числом от 0 до 5" });
  }

  items[productIndex] = {
    id,
    name,
    category,
    description,
    price,
    stock,
    rating: rating || items[productIndex].rating,
    image: image || items[productIndex].image,
  };

  res.json(items[productIndex]);
});

/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     summary: Частично обновить товар
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }

  const productIndex = items.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Товар не найден" });
  }

  // Валидация обновляемых полей
  if (
    updates.price !== undefined &&
    (typeof updates.price !== "number" || updates.price <= 0)
  ) {
    return res
      .status(400)
      .json({ error: "Стоимость должна быть положительным числом" });
  }

  if (
    updates.stock !== undefined &&
    (typeof updates.stock !== "number" || updates.stock < 0)
  ) {
    return res.status(400).json({
      error: "Количество на складе должно быть неотрицательным числом",
    });
  }

  if (
    updates.rating !== undefined &&
    (typeof updates.rating !== "number" ||
      updates.rating < 0 ||
      updates.rating > 5)
  ) {
    return res
      .status(400)
      .json({ error: "Рейтинг должен быть числом от 0 до 5" });
  }

  // Обновляем только переданные поля
  items[productIndex] = { ...items[productIndex], ...updates, id };

  res.json(items[productIndex]);
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Товары]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Некорректный ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Получить все уникальные категории товаров
 *     tags: [Категории]
 *     responses:
 *       200:
 *         description: Список уникальных категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Электроника"
 */
app.get("/categories", (req, res) => {
  const categories = [...new Set(items.map((item) => item.category))];
  res.json(categories);
});

/**
 * @swagger
 * /items/category/{category}:
 *   get:
 *     summary: Найти товары по категории
 *     tags: [Поиск]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Название категории
 *     responses:
 *       200:
 *         description: Товары в указанной категории
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get("/items/category/:category", (req, res) => {
  const category = req.params.category;
  const filteredItems = items.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase(),
  );
  res.json(filteredItems);
});

/**
 * @swagger
 * /items/search/{query}:
 *   get:
 *     summary: Поиск товаров по названию или описанию
 *     tags: [Поиск]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Поисковый запрос
 *     responses:
 *       200:
 *         description: Результаты поиска
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get("/items/search/:query", (req, res) => {
  const query = req.params.query.toLowerCase();
  const searchResults = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
  res.json(searchResults);
});

//Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Swagger документация доступна на http://localhost:${PORT}/api-docs`);
});