// объект товара
export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    amount: number;
    rating: number;
    photo: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: UserRole;
    is_blocked: boolean;
}

export type UserRole = "user" | "admin" | "seller";

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

export type ProductBody = Omit<Product, "id">;
export type UserBody = Omit<User, "id" | "password">;
