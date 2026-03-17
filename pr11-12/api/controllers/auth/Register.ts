import { Request, Response } from "express";
import { User } from "../../types/app.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { addRefreshToken, createUser, generateAccessToken, generateRefreshToken } from "../../db.js";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Регистрирует нового пользователя.
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
 *               first_name:
 *                 type: string
 *                 description: Имя
 *               last_name:
 *                 type: string
 *                 description: Фамилия
 *               password:
 *                 type: string
 *                 description: Пароль
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
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
export function register(req: Request, res: Response) {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const newUser: User = {
        id: nanoid(6),
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: bcrypt.hashSync(password, 10),
        role: "user",
        is_blocked: false,
    };

    createUser(newUser);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    addRefreshToken(refreshToken);

    res.json({ access_token: accessToken, refresh_token: refreshToken });
}
