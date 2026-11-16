import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// TEMPORÁRIO: usuário de teste pra ver as telas sem fazer login.
// Apague quando o login de verdade estiver pronto.
const USUARIO_TESTE = { nome: "João Silva", cargo: "Funcionário" };

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem("usuario");
      return salvo ? JSON.parse(salvo) : USUARIO_TESTE;
    } catch {
      return USUARIO_TESTE;
    }
  });

  function login(dados) {
    setUsuario(dados);
    localStorage.setItem("usuario", JSON.stringify(dados));
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuario");
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