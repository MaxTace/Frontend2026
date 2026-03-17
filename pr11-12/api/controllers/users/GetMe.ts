import express from "express";
import { getUserById } from "../../db.js";
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     description: Получение информации о текущем пользователе
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                    $ref: '#/components/schemas/User'
 */

export function getMe(req: express.Request, res: express.Response) {
    const userId = req.user!.sub;
    const user = getUserById(userId);

    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        },
    });
}
