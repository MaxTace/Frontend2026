import "./EditProductModal.scss";
import { api } from "../../api";
import type { Product, ProductBody } from "../../types/app.js";
import Modal from "../Modal/Modal.js";

interface Props {
    product: Product;
    onClose: () => void;
    onUpdate: (product: Product) => void;
}

export default function EditProductModal(props: Props) {
    // при сабмите формы
    async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        // извлекаем данные из формы
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        const product: ProductBody = {
            name: String(data.name),
            category: String(data.category),
            description: String(data.description),
            price: Number(data.price),
            amount: Number(data.amount),
            rating: Number(data.rating),
            photo: String(data.photo),
        };

        try {
            await api.updateProduct(props.product.id, product);
            // сообщаем родителю об обновленном товаре
            props.onUpdate({ ...product, id: props.product.id });
            props.onClose();
        } catch (error) {
            console.error("Ошибка при изменении продукта:", error);
        }
    }
    return (
        <Modal
            title="Изменение товара"
            onClose={props.onClose}>
            <form onSubmit={onSubmit}>
                <label htmlFor="name">Название</label>
                <input
                    type="text"
                    placeholder="Название"
                    name="name"
                    id="name"
                    defaultValue={props.product.name}
                    required
                />
                <label htmlFor="category">Категория</label>
                <input
                    type="text"
                    placeholder="Категория"
                    name="category"
                    id="category"
                    defaultValue={props.product.category}
                    required
                />

                <label htmlFor="description">Описание</label>
                <input
                    type="text"
                    placeholder="Описание"
                    name="description"
                    id="description"
                    defaultValue={props.product.description}
                    required
                />
                <label htmlFor="price">Цена</label>
                <input
                    type="number"
                    placeholder="Цена"
                    name="price"
                    id="price"
                    defaultValue={props.product.price}
                    required
                />
                <label htmlFor="amount">Количество</label>
                <input
                    type="number"
                    placeholder="Количество"
                    name="amount"
                    id="amount"
                    defaultValue={props.product.amount}
                    required
                />
                <label htmlFor="rating">Рейтинг</label>
                <input
                    type="number"
                    placeholder="Рейтинг"
                    name="rating"
                    id="rating"
                    max={5}
                    min={1}
                    defaultValue={props.product.rating}
                    required
                />
                <label htmlFor="photo">Фото</label>
                <input
                    type="text"
                    placeholder="Фото"
                    name="photo"
                    id="photo"
                    defaultValue={props.product.photo}
                    required
                />
                <button type="submit">Сохранить</button>
            </form>
        </Modal>
    );
}
