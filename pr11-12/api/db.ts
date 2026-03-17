import { Product, ProductBody, User, UserBody } from "./types/app.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import bcrypt from "bcrypt";

// хранилище
const products: Product[] = [
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 1000,
        rating: 4,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 100,
        rating: 2,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 1000,
        rating: 1,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 10,
        rating: 5,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 10000,
        amount: 1000,
        rating: 1,
        photo: "/images/cat.jpg",
    },
];

export function createProduct(data: Product) {
    products.push(data);
}

export function getProducts() {
    return products;
}

export function getProductById(id: string) {
    return products.find((product) => product.id === id);
}

export function updateProduct(id: string, data: ProductBody) {
    const i = products.findIndex((product) => product.id === id);

    // заменяем, либо оставляем старое значение
    products[i] = {
        name: data.name || products[i].name,
        category: data.category || products[i].category,
        description: data.description || products[i].description,
        price: data.price || products[i].price,
        amount: data.amount || products[i].amount,
        rating: data.rating || products[i].rating,
        photo: data.photo || products[i].photo,
        id: id,
    };
}

export function deleteProduct(id: string) {
    const i = products.findIndex((product) => product.id === id);

    if (i == -1) return;

    products.splice(i, 1);
}

const users: User[] = [
    {
        id: nanoid(6),
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "Admin",
        password: bcrypt.hashSync("admin", 10),
        role: "admin",
        is_blocked: false,
    },
    {
        id: nanoid(6),
        email: "seller@example.com",
        first_name: "Seller",
        last_name: "Seller",
        password: bcrypt.hashSync("seller", 10),
        role: "seller",
        is_blocked: false,
    },
    {
        id: nanoid(6),
        email: "user@example.com",
        first_name: "User",
        last_name: "User",
        password: bcrypt.hashSync("user", 10),
        role: "user",
        is_blocked: false,
    },
];

export const getUsers = () => users;

export function createUser(data: User) {
    users.push(data);
}

export function updateUser(id: string, data: UserBody) {
    const i = users.findIndex((user) => user.id === id);

    // заменяем, либо оставляем старое значение
    users[i] = {
        email: data.email || users[i].email,
        first_name: data.first_name || users[i].first_name,
        last_name: data.last_name || users[i].last_name,
        role: data.role || users[i].role,
        is_blocked: data.is_blocked || users[i].is_blocked,
        password: users[i].password,
        id: id,
    };
}

export function banUser(id: string) {
    const i = users.findIndex((user) => user.id === id);

    if (i == -1) return;

    users[i].is_blocked = true;
}

export function unbanUser(id: string) {
    const i = users.findIndex((user) => user.id === id);

    if (i == -1) return;

    users[i].is_blocked = false;
}

export function getUserById(id: string): User | undefined {
    return users.find((user) => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
}

const refreshTokens = new Set<String>();

export function generateAccessToken(user: User) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
        },
        config.ACCESS_SECRET,
        {
            expiresIn: config.ACCESS_EXPIRES_IN,
        },
    );
}
export function generateRefreshToken(user: User) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
        },
        config.ACCESS_REFRESH_SECRET,
        {
            expiresIn: config.ACCESS_REFRESH_EXPIRES_IN,
        },
    );
}

export function addRefreshToken(token: string) {
    refreshTokens.add(token);
}

export function refreshTokenExists(token: string) {
    return refreshTokens.has(token);
}

export function removeRefreshToken(token: string) {
    refreshTokens.delete(token);
}
