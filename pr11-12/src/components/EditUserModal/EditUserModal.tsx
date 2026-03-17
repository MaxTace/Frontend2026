import { api } from "../../api";
import type { User } from "../../types/app";
import Modal from "../Modal/Modal";
import "./EditUserModal.scss";

interface Props {
    onClose: () => void;
    user: User;
    onUpdate: (user: User) => void;
}

export default function EditUserModal({ onClose, user, onUpdate }: Props) {
    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            await api.updateUser(user.id, {
                first_name: data.firstName as string,
                last_name: data.lastName as string,
                email: data.email as string,
            });

            onClose();
            onUpdate({
                ...user,
                first_name: data.firstName as string,
                last_name: data.lastName as string,
                email: data.email as string,
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    return (
        <Modal
            title="Изменение пользователя"
            onClose={onClose}>
            <form onSubmit={onSubmit}>
                <label htmlFor="firstName">Имя</label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={user.first_name}
                />
                <label htmlFor="lastName">Фамилия</label>
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={user.last_name}
                />
                <label htmlFor="email">Почта</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                />
                <button type="submit">Сохранить</button>
            </form>
        </Modal>
    );
}
