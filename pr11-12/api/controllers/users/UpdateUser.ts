import { getUserById as dbGetUserById, updateUser as dbUpdateUser } from "../../db.js";
import { Request, Response } from "express";

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет существующего пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Имя
 *               last_name:
 *                 type: string
 *                 description: Фамилия
 *               email:
 *                 type: string
 *                 description: Почта
 *               is_blocked:
 *                 type: boolean
 *                 description: Заблокирован ли пользователь
 *               role:
 *                 type: string
 *                 description: Роль пользователя
 *     responses:
 *       200:
 *         description: Информация успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated
 *                 product:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в теле запроса
 */
export function updateUser(req: Request, res: Response) {
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

    // извлекаем параметры из body
    const { first_name, last_name, email, is_blocked, role } = req.body;

    // валидация
    if (!first_name && !last_name && !email && is_blocked === undefined && !role) {
        return res.status(400).json({ message: "At least one field must be provided" });
    }

    // делаем замену. Если какой-либо параметр не был предоставлен, то будет использоваться старое
    dbUpdateUser(id as string, { first_name, last_name, email, is_blocked, role });

    return res.status(200).json({ message: "User updated" });
}
