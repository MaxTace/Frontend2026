import express from "express";
import { UserRole } from "../types/app.js";
export function roleMiddleware(allowedRoles: UserRole[]) {
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        next();
    };
}
