import express from "express";
import { getUsers as getUsersInternal } from "../../db.js";
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получение списка всех пользователей
 *     description: Получение информации о всех пользователях
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
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

export function getUsers(req: express.Request, res: express.Response) {
    res.json({
        users: getUsersInternal(),
    });
}
