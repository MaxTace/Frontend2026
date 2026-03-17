import { useState } from "react";
import { api } from "../../api";
import Modal from "../Modal/Modal";
import "./AuthModal.scss";
import { useAuth } from "../../context/AuthContext.js";

interface Props {
    onClose: () => void;
}

export default function LoginModal(props: Props) {
    const [currentPage, setCurrentPage] = useState<"login" | "register">("login");
    const { login } = useAuth();

    async function onLogin(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        // получаем данные из формы
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        const email = data.email as string;
        const password = data.password as string;

        try {
            const response = await api.login(email, password);
            login(response.access_token, response.refresh_token);
            props.onClose();
        } catch (error) {
            console.error(error);
        }
    }

    async function onRegister(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        // получаем данные из формы
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        const firstName = data.firstName as string;
        const lastName = data.lastName as string;
        const email = data.email as string;
        const password = data.password as string;

        console.log({ firstName, lastName, email, password });

        try {
            const response = await api.register(email, password, firstName, lastName);
            login(response.access_token, response.refresh_token);
            props.onClose();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal
            title="Вход"
            onClose={props.onClose}>
            {currentPage === "login" ? (
                <>
                    <form onSubmit={onLogin}>
                        <label htmlFor="email">Почта</label>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            placeholder="Почта"
                        />
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Пароль"
                        />
                        <button type="submit">Войти</button>
                    </form>
                    <div className="auth-action">
                        Нет аккаунта? <span onClick={() => setCurrentPage("register")}>Зарегистрироваться</span>
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={onRegister}>
                        <label htmlFor="firstName">Имя</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="Имя"
                        />
                        <label htmlFor="lastName">Фамилия</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            placeholder="Фамилия"
                        />
                        <label htmlFor="email">Почта</label>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            placeholder="Почта"
                        />
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Пароль"
                        />
                        <button type="submit">Войти</button>
                    </form>
                    <div className="auth-action">
                        Есть аккаунт? <span onClick={() => setCurrentPage("login")}>Войти</span>
                    </div>
                </>
            )}
        </Modal>
    );
}
