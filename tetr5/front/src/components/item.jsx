import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  const handleEdit = () => {
    if (onEdit && typeof onEdit === 'function') {
      onEdit(product);
    } else {
      console.warn('onEdit is not available or not a function');
    }
  };

  const handleDelete = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(product.id);
    } else {
      console.warn('onDelete is not available or not a function');
    }
  };

  return (
    <div className="userRow">
      <div className="userMain">
        <div className="userId">#{product.id}</div>
        <div className="userName">{product.name}</div>
        <div className="userAge">{product.price} ₽</div>
        <div className="userAge">На складе: {product.stock}</div>
      </div>

      <div className="userActions">
        {onEdit && (
          <button className="btn" onClick={handleEdit}>
            Редактировать
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn--danger"
            onClick={handleDelete}
          >
            Удалить
          </button>
        )}
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
            }}
          />
        )}
      </div>
    </div>
  );
}