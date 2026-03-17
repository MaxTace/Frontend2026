import { createProduct as dbCreateProduct } from "../../db.js";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - amount
 *               - rating
 *               - photo
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название товара
 *               category:
 *                 type: string
 *                 description: Категория товара
 *               description:
 *                 type: string
 *                 description: Описание товара
 *               price:
 *                 type: number
 *                 description: Цена товара
 *               amount:
 *                 type: integer
 *                 description: Количество товара на складе
 *               rating:
 *                 type: number
 *                 description: Рейтинг товара
 *               photo:
 *                 type: string
 *                 description: URL фотографии товара
 *     responses:
 *       200:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
export function createProduct(req: Request, res: Response) {
    const { name, category, description, price, amount, rating, photo } = req.body;

    // валидация
    if (
        !name ||
        !category ||
        !description ||
        price === undefined ||
        amount === undefined ||
        rating === undefined ||
        !photo
    ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // создаем объект товар
    const newProduct = {
        name,
        category,
        description,
        price,
        amount,
        rating,
        photo,
        id: nanoid(6),
    };

    // добавляем товар в бд
    dbCreateProduct(newProduct);

    return res.status(200).json({ message: "Product created", product: newProduct });
}
