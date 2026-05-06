import React, { useEffect, useState } from "react";

export default function ProductModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialProduct) {
      setName(initialProduct.name ?? "");
      setCategory(initialProduct.category ?? "");
      setDescription(initialProduct.description ?? "");
      setPrice(initialProduct.price ?? "");
      setStock(initialProduct.stock ?? "");
      setRating(initialProduct.rating ?? "");
    } else {
      // Очищаем форму при создании нового товара
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
      setRating("");
    }
  }, [open, mode, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация
    if (!name.trim()) {
      alert("Введите название товара");
      return;
    }
    if (!category.trim()) {
      alert("Введите категорию товара");
      return;
    }
    if (!description.trim()) {
      alert("Введите описание товара");
      return;
    }
    
    const priceNum = Number(price);
    const stockNum = Number(stock);
    
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Цена должна быть положительным числом");
      return;
    }
    
    if (isNaN(stockNum) || stockNum < 0) {
      alert("Количество на складе должно быть неотрицательным числом");
      return;
    }

    const productData = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: priceNum,
      stock: stockNum,
      rating: rating ? Number(rating) : 0,
    };

    // Если это редактирование, добавляем id
    if (mode === "edit" && initialProduct) {
      productData.id = initialProduct.id;
    }

    onSubmit(productData);
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название товара"
              required
            />
          </label>

          <label className="label">
            Категория *
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Введите категорию"
              required
            />
          </label>

          <label className="label">
            Описание *
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание товара"
              rows="3"
              required
            />
          </label>

          <label className="label">
            Цена *
            <input
              className="input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Введите цену"
              required
            />
          </label>

          <label className="label">
            Количество на складе *
            <input
              className="input"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Введите количество"
              required
            />
          </label>

          <label className="label">
            Рейтинг (0-5)
            <input
              className="input"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Введите рейтинг"
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}