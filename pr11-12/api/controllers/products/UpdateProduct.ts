import { getProductById as dbGetProductById, updateProduct as dbUpdateProduct } from "../../db.js";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет существующий товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Товар успешно обновлен
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
export function updateProduct(req: Request, res: Response) {
    const { id } = req.params;

    // валидация
    if (!id) {
        return res.status(400).json({ message: "Missing product ID" });
    }

    const product = dbGetProductById(id as string);

    // проверяем, найден ли товар
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // извлекаем параметры из body
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

    // делаем замену. Если какой-либо параметр не был предоставлен, то будет использоваться старое
    dbUpdateProduct(id as string, { name, category, description, price, amount, rating, photo });

    return res.status(200).json({ message: "Product updated" });
}
