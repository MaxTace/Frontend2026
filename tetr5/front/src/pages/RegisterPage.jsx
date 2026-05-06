import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPages.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Очищаем ошибки при вводе
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Клиентская валидация
    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Введите корректный email адрес");
      setLoading(false);
      return;
    }

    try {
      const response = await api.register(formData);
      console.log("Registration successful:", response);
      setSuccess("Регистрация успешна! Перенаправление на страницу входа...");
      
      // Перенаправляем через 2 секунды
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Регистрация успешна! Теперь вы можете войти." },
        });
      }, 2000);
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.status === 409) {
        setError("Пользователь с таким email уже существует");
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Проверьте правильность заполнения полей");
      } else {
        setError("Ошибка при регистрации. Проверьте подключение к серверу.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Регистрация</h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Придумайте пароль (минимум 6 символов)"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Имя</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ваше имя"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Фамилия</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Ваша фамилия"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Уже есть аккаунт? Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;