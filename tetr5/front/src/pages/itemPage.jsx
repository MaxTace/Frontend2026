import React, { useEffect, useState } from "react";
import "./itemPage.scss";
import ItemsList from "../components/itemList";
import ProductModal from "../components/itemModal";
import { api } from "../api/index";
import { useNavigate } from "react-router-dom";

export default function ItemsPage() {
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    loadCurrentUser();
    loadItems();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to load user", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Удалить товар?");
    if (!ok) return;

    try {
      await api.deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      alert("Товар успешно удален");
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления товара");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newProduct = await api.createProduct(payload);
        setItems((prev) => [...prev, newProduct]);
      } else {
        const updated = await api.updateProduct(payload.id, payload);
        setItems((prev) =>
          prev.map((p) => (p.id === payload.id ? updated : p)),
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    }
  };

  const canCreateOrEdit = currentUser && (currentUser.role === "seller" || currentUser.role === "admin");
  const canDelete = currentUser && currentUser.role === "admin";

  // Создаем функции только если есть права
  const handleEditFunction = canCreateOrEdit ? openEdit : null;
  const handleDeleteFunction = canDelete ? handleDelete : null;

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">Shop</div>
          <div className="header__right">
            {currentUser && `${currentUser.email} (${currentUser.role})`}
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/login");
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Товары</h1>
            {canCreateOrEdit && (
              <button className="btn btn--primary" onClick={openCreate}>
                + Добавить товар
              </button>
            )}
          </div>

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : (
            <ItemsList
              items={Items}
              onEdit={handleEditFunction}
              onDelete={handleDeleteFunction}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">© {new Date().getFullYear()} Shop</div>
      </footer>

      {modalOpen && (
        <ProductModal
          open={modalOpen}
          mode={modalMode}
          initialProduct={editingProduct}
          onClose={closeModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </div>
  );
}