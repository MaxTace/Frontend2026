import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { generateAccessToken, generateRefreshToken, getUserById, removeRefreshToken } from "../../db.js";
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Ротация refresh-токена
 *     description: Ротация refresh-токена.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 format: text
 *                 description: Refresh-токен
 *             required:
 *               - refresh_token
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 */
export function refresh(req: Request, res: Response) {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    try {
        const payload = jwt.verify(refreshToken, config.ACCESS_REFRESH_SECRET);

        if (typeof payload.sub !== "string") {
            throw new Error();
        }

        const user = getUserById(payload.sub);

        removeRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        return res.status(200).json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        });
    } catch (error) {
        return res.status(401).json({
            message: "Невалидный refresh-токен",
        });
    }
}
