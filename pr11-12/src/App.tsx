import { Route, Routes } from "react-router";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import Header from "./components/Header/Header";
import { useState } from "react";
import AuthModal from "./components/AuthModal/AuthModal";

function App() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <Header authRequired={() => setShowAuthModal(true)} />
            <Routes>
                <Route
                    path="/"
                    element={<ProductsPage />}
                />
                <Route
                    path="/admin"
                    element={<AdminPage />}
                />
            </Routes>

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
}

export default App;
