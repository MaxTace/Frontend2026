import { getUserById as dbGetUserById, banUser as dbBanUser } from "../../db.js";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Блокирует пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User was successfully banned
 *       400:
 *         description: Ошибка в параметрах запроса
 *       404:
 *         description: Пользователь не найден
 */
export function banUser(req: Request, res: Response) {
    const { id } = req.params;

    // валидация
    if (!id) {
        return res.status(400).json({ message: "Missing user ID" });
    }

    const user = dbGetUserById(id as string);

    // проверяем, найден ли пользователь
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // блокируем
    dbBanUser(id as string);

    return res.status(200).json({ message: "User was successfully banned" });
}
