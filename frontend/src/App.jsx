import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Clientes from "./pages/Clientes/Clientes";
import CadastrarCliente from "./pages/Clientes/CadastrarCliente";
import Categorias from "./pages/Categorias/Categorias";
import Produtos from "./pages/Produtos/Produtos";
import Pedidos from "./pages/Pedidos/Pedidos";
import NovoPedido from "./pages/Pedidos/NovoPedido";
import Inicio from "./pages/Inicio/Inicio";
import Financeiro from "./pages/Financeiro/Financeiro";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/novo" element={<CadastrarCliente />} />
            <Route path="/clientes/:id/editar" element={<CadastrarCliente />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/novo" element={<NovoPedido />} />
            <Route path="/financeiro" element={<Financeiro />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}