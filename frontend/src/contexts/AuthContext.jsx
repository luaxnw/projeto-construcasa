
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        try {
            const token = localStorage.getItem("token");
            const salvo = localStorage.getItem("usuario");

            if (!token || !salvo) return null;

            return JSON.parse(salvo);
        } catch {
            return null;
        }
    });

    function login(dados) {
        setUsuario(dados);
        localStorage.setItem("usuario", JSON.stringify(dados));
    }

    function logout() {
        setUsuario(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
