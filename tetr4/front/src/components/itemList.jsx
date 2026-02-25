import React from "react";
import ProductItem from "./item";

export default function ProductsList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <div className="empty">Товаров пока нет</div>;
  }

  return (
    <div className="list">
      {items.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
