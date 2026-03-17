import { getProductById as dbGetProductById, deleteProduct as dbDeleteProduct } from "../../db.js";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product was successfully deleted
 *       400:
 *         description: Ошибка в параметрах запроса
 *       404:
 *         description: Товар не найден
 */
export function deleteProduct(req: Request, res: Response) {
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

    // удаляем
    dbDeleteProduct(id as string);

    return res.status(200).json({ message: "Product was successfully deleted" });
}
