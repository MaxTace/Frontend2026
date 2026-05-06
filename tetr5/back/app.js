const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

const CACHE_TTL = 60;
const getCache = async (key) => {
  if (!redisClient.isOpen) return null;
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
};

const setCache = async (key, value, ttl = CACHE_TTL) => {
  if (!redisClient.isOpen) return;
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

const invalidateCache = async (pattern) => {
  if (!redisClient.isOpen) return;
  const keys = await redisClient.keys(pattern);
  if (keys.length) {
    await redisClient.del(keys);
  }
};

const cacheMiddleware = (cacheKeyOrFn, ttl = CACHE_TTL) => {
  return async (req, res, next) => {
    try {
      const cacheKey =
        typeof cacheKeyOrFn === "function" ? cacheKeyOrFn(req) : cacheKeyOrFn;
      const cached = await getCache(cacheKey);
      if (cached) {
        return res.json({ data: cached, source: "cache" });
      }
      res.locals.cacheKey = cacheKey;
      res.locals.cacheTtl = ttl;
      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
};

const cacheResponse = async (res, data) => {
  if (res.locals.cacheKey) {
    await setCache(res.locals.cacheKey, data, res.locals.cacheTtl || CACHE_TTL);
  }
  res.json(data);
};

const USERS_CACHE_KEY = "api:users";
const getUserCacheKey = (id) => `api:users:${id}`;
const PRODUCTS_CACHE_KEY = "api:products";
const getProductCacheKey = (id) => `api:products:${id}`;

const app = express();
const PORT = 3000;

const ACCESS_SECRET = "access_secret_key_change_in_production";
const REFRESH_SECRET = "refresh_secret_key_change_in_production";
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Важно!
  })
);

// Добавьте обработку OPTIONS запросов
app.options('*', cors({
  origin: "http://localhost:3001",
  credentials: true,
}));

app.use(express.json());
let users = [];
let refreshTokens = new Set();

<<<<<<< HEAD
const createTestUser = async () => {
  const testUser = {
    id: "1",
    email: "test@mail.ru",
    passwordHash: "password123",
    first_name: "Тест",
    last_name: "Тестов",
    role: "admin",
  };

  const exists = users.some((u) => u.email === testUser.email);
  if (!exists) {
    const bcrypt = require("bcrypt");
    const passwordHash = await bcrypt.hash("password123", 10);
    users.push({
      id: "1",
      email: "test@mail.ru",
      passwordHash,
      first_name: "Тест",
      last_name: "Тестов",
      role: "admin",
    });
    console.log("✓ Тестовый пользователь создан:");
    console.log("  Email: test@mail.ru");
    console.log("  Пароль: password123");
=======
// Функция для создания тестового пользователя
const createTestUser = async () => {
  try {
    const exists = users.some((u) => u.email === "test@mail.ru");
    if (!exists) {
      const passwordHash = await bcrypt.hash("password123", SALT_ROUNDS);
      users.push({
        id: "1",
        email: "test@mail.ru",
        passwordHash,
        first_name: "Тест",
        last_name: "Тестов",
        role: "admin",
      });
      console.log("✓ Тестовый пользователь создан:");
      console.log("  Email: test@mail.ru");
      console.log("  Пароль: password123");
    }
  } catch (error) {
    console.error("Ошибка при создании тестового пользователя:", error);
>>>>>>> 7b1a366e5cc05c95aeac08e09207e941c54a8eba
  }
};

// Исправленный вызов асинхронной функции
createTestUser().catch(console.error);
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
    image:
      "https://static.insales-cdn.com/images/products/1/5788/894187164/2024-08-11_16-14-11.png",
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
    image:
      "https://www.tveragroprom.com/wp-content/uploads/2023/10/nature-plant-field-fruit-food-produce-1334453-pxhere.com_.jpg",
  },
  {
    id: 5,
    name: "Молоко 2.5%",
    category: "Продукты",
    description: "Пастеризованное молоко отборного качества, 1 литр",
    price: 350,
    stock: 45,
    rating: 4.6,
    image:
      "https://ecomilk.ru/upload/iblock/8d4/7us50mu65vv4ujm5trnkzvzh9vnyvp5z.png",
  },
  {
    id: 6,
    name: "Корм для кошек премиум",
    category: "Зоотовары",
    description: "Сухой корм для кошек с курицей и овощами, 2 кг",
    price: 2000,
    stock: 12,
    rating: 4.9,
    image:
      "https://katiko.ru/image/cache/catalog/2021/monge/855/70011938-2-1200x1200.jpg",
  },
  {
    id: 7,
    name: "Кукуруза консервированная",
    category: "Продукты",
    description: "Консервированная кукуруза, банка 400 г",
    price: 50,
    stock: 60,
    rating: 4.2,
    image:
      "https://www.deloks.ru/upload/iblock/8ec/b4m567xupnzqzhyc7lnfp7tzp3clxd7y/kukuruza_bondyuel_konservirovannaya_340_g_1_full.jpg",
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
    image:
      "https://opttorg-horeca.ru/assets/images/catalog/konditerskie-izdeliya/shokoladnye-konfety-assorti-miks-ekstra.jpg",
  },
  {
    id: 10,
    name: "Напиток Добри Кола",
    category: "Напитки",
    description: "Газированный напиток Coca-Cola, 1.5 литра",
    price: 100,
    stock: 50,
    rating: 4.1,
    image:
      "https://tsx.x5static.net/i/800x800-fit/xdelivery/files/4b/a0/5426a8e1e461aab5e588d424160b.jpg",
  },
  {
    id: 11,
    name: "Наушники Sony",
    category: "Электроника",
    description: "Беспроводные наушники с шумоподавлением и 30 часами работы",
    price: 8900,
    stock: 7,
    rating: 4.8,
    image:
      "https://image.kazanexpress.ru/crj9b8p1uakkt3hiu200/t_product_high.jpg",
  },
  {
    id: 12,
    name: "Корм для собак",
    category: "Зоотовары",
    description: "Сухой корм для собак мелких пород с ягненком, 3 кг",
    price: 2800,
    stock: 10,
    rating: 4.7,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6c7FVzFr6fsz9-0NfRJYIDxy4gOoeOf-fA&s",
  },
];

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Товары API",
      version: "1.0.0",
      description: "API для управления товарами в интернет-магазине",
      contact: {
        name: "Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Локальный сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Item: {
          type: "object",
          required: ["name", "category", "description", "price", "stock"],
          properties: {
            id: {
              type: "integer",
              description: "Уникальный идентификатор товара",
              example: 1,
            },
            name: {
              type: "string",
              description: "Название товара",
              example: "Игровой ноутбук MSI",
            },
            category: {
              type: "string",
              description: "Категория товара",
              example: "Электроника",
            },
            description: {
              type: "string",
              description: "Описание товара",
              example: "Мощный игровой ноутбук с видеокартой RTX 3060",
            },
            price: {
              type: "number",
              description: "Цена товара",
              example: 75000,
            },
            stock: {
              type: "integer",
              description: "Количество на складе",
              example: 5,
            },
            rating: {
              type: "number",
              description: "Рейтинг товара (0-5)",
              example: 4.8,
            },
            image: {
              type: "string",
              description: "URL изображения товара",
              example: "https://example.com/images/msi-laptop.jpg",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Сообщение об ошибке",
            },
          },
        },
        DeleteResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Товар успешно удален",
            },
            deletedProduct: {
              $ref: "#/components/schemas/Item",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            email: { type: "string", example: "user@example.com" },
            first_name: { type: "string", example: "Иван" },
            last_name: { type: "string", example: "Иванов" },
            role: { type: "string", example: "user" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Вспомогательные функции для JWT ---
const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN },
  );
};

// --- Middleware для аутентификации ---
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// --- Middleware для проверки ролей ---
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

// ========== МАРШРУТЫ АУТЕНТИФИКАЦИИ ==========

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Иванов
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Пользователь уже существует
 */
app.post("/api/auth/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // Валидация
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Проверка email формата
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Проверка длины пароля
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // Проверка существующего пользователя
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Генерация правильного ID
    const newId = String(users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1);
    
    const newUser = {
      id: newId,
      email,
      passwordHash,
      first_name,
      last_name,
      role: "user",
    };
    
    users.push(newUser);
<<<<<<< HEAD
    await invalidateCache("api:users*");
=======
    
    console.log(`✓ Новый пользователь зарегистрирован: ${email}`);
>>>>>>> 7b1a366e5cc05c95aeac08e09207e941c54a8eba

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неверные учетные данные
 */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.add(refreshToken);

  res.json({ accessToken, refreshToken });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление пары токенов
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Отсутствует refreshToken
 *       401:
 *         description: Невалидный или истекший refresh token
 */
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken is required" });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = users.find((u) => u.id === payload.sub);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    refreshTokens.delete(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.add(newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const userId = req.user.sub;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });
});

// ========== МАРШРУТЫ ДЛЯ УПРАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯМИ (ТОЛЬКО АДМИН) ==========

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить всех пользователей (только для администратора)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Недостаточно прав
 */
app.get(
  "/api/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  cacheMiddleware(USERS_CACHE_KEY),
  async (req, res) => {
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    await cacheResponse(res, safeUsers);
  },
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID (только для администратора)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.get(
  "/api/users/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  cacheMiddleware((req) => getUserCacheKey(req.params.id)),
  async (req, res) => {
    const user = users.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { passwordHash, ...safeUser } = user;
    await cacheResponse(res, safeUser);
  },
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить информацию пользователя (только для администратора)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.put(
  "/api/users/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const userId = req.params.id;
    const { email, first_name, last_name, role } = req.body;

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = {
      ...users[userIndex],
      email: email || users[userIndex].email,
      first_name: first_name || users[userIndex].first_name,
      last_name: last_name || users[userIndex].last_name,
      role: role || users[userIndex].role,
    };

    users[userIndex] = updatedUser;
    await invalidateCache("api:users*");

    const { passwordHash, ...safeUser } = updatedUser;
    res.json(safeUser);
  },
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить пользователя (только для администратора)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 */
app.delete(
  "/api/users/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    refreshTokens.forEach((token) => {
      try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        if (payload.sub === userId) {
          refreshTokens.delete(token);
        }
      } catch (err) {
        refreshTokens.delete(token);
      }
    });

    await invalidateCache("api:users*");
    await redisClient.del(getUserCacheKey(userId));

    res.json({ message: "User deleted successfully" });
  },
);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Получить все товары (доступно всем авторизованным)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
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
app.get(
  "/items",
  authMiddleware,
  cacheMiddleware(PRODUCTS_CACHE_KEY),
  (req, res) => {
    cacheResponse(res, items);
  },
);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Получить товар по ID (доступно всем авторизованным)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
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
 */
app.get(
  "/items/:id",
  authMiddleware,
  cacheMiddleware((req) => getProductCacheKey(req.params.id)),
  (req, res) => {
    const id = parseInt(req.params.id);
    const product = items.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    cacheResponse(res, product);
  },
);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Создать новый товар (только продавец или админ)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *       400:
 *         description: Ошибка валидации
 *       403:
 *         description: Недостаточно прав
 */
app.post(
  "/items",
  authMiddleware,
  roleMiddleware(["seller", "admin"]),
  cacheMiddleware(PRODUCTS_CACHE_KEY),
  async (req, res) => {
    const { name, category, description, price, stock, rating, image } =
      req.body;

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

    // Исправленная генерация ID
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name,
      category,
      description,
      price,
      stock,
      rating: rating || 0,
      image: image || null,
    };

    items.push(newProduct);
    await invalidateCache("api:products*");
    res.status(201).json(newProduct);
  },
);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Полностью обновить товар (только продавец или админ)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Товар обновлен
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Товар не найден
 */
app.put(
  "/items/:id",
  authMiddleware,
  roleMiddleware(["seller", "admin"]),
  async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, category, description, price, stock, rating, image } =
      req.body;

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
      ...items[productIndex],
      name,
      category,
      description,
      price,
      stock,
      rating: rating || items[productIndex].rating,
      image: image || items[productIndex].image,
      id: id, // убеждаемся, что ID не меняется
    };

    await invalidateCache("api:products*");
    await redisClient.del(getProductCacheKey(id));
    res.json(items[productIndex]);
  },
);

/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     summary: Частично обновить товар (только продавец или админ)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Товар обновлен
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Товар не найден
 */
app.patch(
  "/items/:id",
  authMiddleware,
  roleMiddleware(["seller", "admin"]),
  async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Некорректный ID" });
    }

    const productIndex = items.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Товар не найден" });
    }

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

    items[productIndex] = { ...items[productIndex], ...updates, id };
    await invalidateCache("api:products*");
    await redisClient.del(getProductCacheKey(id));
    res.json(items[productIndex]);
  },
);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Удалить товар (только администратор)
 *     tags: [Товары]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Товар удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Товар не найден
 */
app.delete(
  "/items/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Некорректный ID" });
    }

    const productIndex = items.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    const deletedProduct = items.splice(productIndex, 1)[0];
    await invalidateCache("api:products*");
    await redisClient.del(getProductCacheKey(id));
    res.json({
      message: "Товар успешно удален",
      deletedProduct,
    });
  },
);

// ========== ДОПОЛНИТЕЛЬНЫЕ МАРШРУТЫ ==========

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Получить все уникальные категории товаров
 *     tags: [Категории]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список уникальных категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
app.get("/categories", authMiddleware, (req, res) => {
  const categories = [...new Set(items.map((item) => item.category))];
  res.json(categories);
});

/**
 * @swagger
 * /items/category/{category}:
 *   get:
 *     summary: Найти товары по категории
 *     tags: [Поиск]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
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
app.get("/items/category/:category", authMiddleware, (req, res) => {
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
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
app.get("/items/search/:query", authMiddleware, (req, res) => {
  const query = req.params.query.toLowerCase();
  const searchResults = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
  res.json(searchResults);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(
    `Swagger документация доступна на http://localhost:${PORT}/api-docs`,
  );
  console.log(`Auth endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/auth/refresh`);
  console.log(`  GET    /api/auth/me`);
  console.log(`  GET    /api/users (admin only)`);
  console.log(`  PUT    /api/users/:id (admin only)`);
  console.log(`  DELETE /api/users/:id (admin only)`);
});
