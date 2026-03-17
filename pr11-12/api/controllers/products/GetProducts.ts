import { getProducts as dbGetProducts } from "../../db.js";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получает все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Товары найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
export function getProducts(req: Request, res: Response) {
    return res.status(200).json({ products: dbGetProducts() });
}
