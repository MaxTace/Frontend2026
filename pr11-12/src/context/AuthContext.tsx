import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api.js";
import type { User } from "../types/app.js";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("accessToken");
    });
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (isAuthenticated && !user) {
            api.getMe()
                .then((data) => setUser(data.user))
                .catch(() => {
                    logout();
                });
        }
    }, [isAuthenticated, user]);

    const login = (accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setUser(null);
    };

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext)!;
