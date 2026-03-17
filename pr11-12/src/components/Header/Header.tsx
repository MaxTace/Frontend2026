import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "./Header.scss";

interface Props {
    authRequired: () => void;
}

export default function Header({ authRequired }: Props) {
    const { isAuthenticated, user, logout } = useAuth();
    return (
        <header className="app-header">
            <h1>
                <Link to="/">КОТЗОН</Link>
            </h1>
            {!isAuthenticated && (
                <button
                    className="sign-in"
                    onClick={authRequired}>
                    Войти
                </button>
            )}
            {isAuthenticated && (
                <div className="user-info">
                    {user && (
                        <span className="user-name">
                            {user.first_name} {user.last_name}
                        </span>
                    )}
                    <div
                        className="logout"
                        onClick={logout}
                        title="Выйти">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </header>
    );
}
