import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, getUserByEmail } from "../../db.js";
import bcrypt from "bcrypt";
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     description: Позволяет пользователю войти в систему.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Почта
 *               password:
 *                 type: string
 *                 description: Пароль
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Пользователь успешно вошел в систему
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
export function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const user = getUserByEmail(email);

    if (!user) {
        return res.status(401).json({ message: "Почта или пароль неверны" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Почта или пароль неверны" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ access_token: accessToken, refresh_token: refreshToken });
}
