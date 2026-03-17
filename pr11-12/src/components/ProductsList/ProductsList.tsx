import type { Product } from "../../types/app.js";
import ProductItem from "../ProductItem/ProductItem";
import "./ProductsList.scss";

interface Props {
    products: Product[];
    // события для информирования родителя
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export default function ProductsList(props: Props) {
    return (
        <div className="products-list">
            {props.products.map((product) => (
                <ProductItem
                    data={product}
                    key={product.id}
                    onDelete={() => props.onDelete(product.id)}
                    onEdit={() => props.onEdit(product.id)}
                />
            ))}
        </div>
    );
}
