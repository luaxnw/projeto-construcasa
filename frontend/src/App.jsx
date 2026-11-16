import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<Layout />}>
                <Route path="/" element={<h2>Início</h2>} />
                <Route path="/clientes" element={<h2>Clientes</h2>} />
                <Route path="/produtos" element={<h2>Produtos</h2>} />
                <Route path="/pedidos" element={<h2>Pedidos</h2>} />
                </Route>
            </Routes>
            </BrowserRouter>
    </AuthProvider>
  );
}