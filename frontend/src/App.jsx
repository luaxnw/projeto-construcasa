import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Clientes from "./pages/Clientes/Clientes";
import CadastrarCliente from "./pages/Clientes/CadastrarCliente";
import Categorias from "./pages/Categorias/Categorias";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<Layout />}>
                <Route path="/" element={<h2>Início</h2>} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<CadastrarCliente />} />
                <Route path="/clientes/:id/editar" element={<CadastrarCliente />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/produtos" element={<h2>Produtos</h2>} />
                <Route path="/pedidos" element={<h2>Pedidos</h2>} />
                </Route>
            </Routes>
            </BrowserRouter>
    </AuthProvider>
  );
}