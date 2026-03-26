import React from "react";
import ProductItem from "./item";

export default function ProductsList({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <div className="empty">Товаров пока нет</div>;
  }

  // Проверяем, что onEdit и onDelete - функции, если они переданы
  const handleEdit = (product) => {
    if (onEdit && typeof onEdit === 'function') {
      onEdit(product);
    }
  };

  const handleDelete = (id) => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(id);
    }
  };

  return (
    <div className="list">
      {items.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={onEdit ? handleEdit : null}
          onDelete={onDelete ? handleDelete : null}
        />
      ))}
    </div>
  );
}