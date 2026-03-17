import type { Product } from "../../types/app.js";
import "./ProductItem.scss";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext.js";

interface Props {
    data: Product;
    onDelete: () => void;
    onEdit: (id: string) => void;
}

export default function ProductItem(props: Props) {
    const { isAuthenticated, user } = useAuth();

    async function deleteProduct() {
        try {
            await api.deleteProduct(props.data.id);
            // сообщаем родителю об удалении товара
            props.onDelete();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="product">
            <img
                src={props.data.photo}
                alt=""
                className="product__photo"
            />
            <div className="product__texts">
                <h2 className="product__title">{props.data.name}</h2>
                <div className="product__rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            className={star <= (props.data.rating || 0) ? "star--filled" : "star--empty"}>
                            <path
                                fill="currentColor"
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            />
                        </svg>
                    ))}
                </div>
                <div className="product__tech-data">
                    <span className="product__id">#{props.data.id}</span>
                    <span className="product__category">{props.data.category}</span>
                </div>

                <p className="product__description">{props.data.description}</p>
                <div className="product__price">
                    <span className="product__price-val">{props.data.price}</span>
                    <span>₽</span>
                </div>
            </div>
            <div className="product__right-content">
                {["seller"].includes(user?.role || "") && (
                    <div className="product__actions">
                        <button
                            className="product__edit"
                            onClick={() => props.onEdit(props.data.id)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                                />
                            </svg>
                        </button>
                        <button
                            className="product__delete"
                            onClick={() => deleteProduct()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="product__stats">
                    <div className="product__amount">{props.data.amount} шт</div>
                </div>
            </div>
        </div>
    );
}
