import express from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getUserById } from "../db.js";
export function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authorization = req.headers.authorization || "";

    const [scheme, token] = authorization.split(" ");

    if (scheme != "Bearer" || !token) {
        return res.status(401).json({
            message: "Missing or invalid Authorization header",
        });
    }

    try {
        const payload = jwt.verify(token, config.ACCESS_SECRET);

        req.user = payload as any;

        const user = getUserById(req.user.sub);

        if (user.is_blocked) {
            return res.status(403).json({
                message: "You are blocked",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}
