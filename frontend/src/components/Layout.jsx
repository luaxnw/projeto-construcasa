import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import "./Layout.css";

const menu = [
    { nome: "Início", rota: "/" },
    { nome: "Clientes", rota: "/clientes" },
    { nome: "Categorias", rota: "/categorias" },
    { nome: "Produtos", rota: "/produtos" },
    { nome: "Pedidos", rota: "/pedidos" },
    { nome: "Financeiro", rota: "/financeiro" },
];

function Menu({ onClick }) {
    return (
        <Nav className="flex-column gap-1">
            {menu.map((item) => (
                <Nav.Link
                    key={item.rota}
                    as={NavLink}
                    to={item.rota}
                    end={item.rota === "/"}
                    onClick={onClick}
                    className="text-center rounded"
                >
                    {item.nome}
                </Nav.Link>
            ))}
        </Nav>
    );
}

export default function Layout() {
    const [aberto, setAberto] = useState(false);
    const { usuario } = useAuth();

    return (
        <div className="d-flex min-vh-100">
            <aside className="sidebar d-none d-lg-flex flex-column p-3">
                <h1 className="h5 text-center mb-4">construcasa</h1>
                <Menu />
                <div className="mt-auto usuario-card">
                    <div className="avatar" />
                    <div>
                        <div className="nome">{usuario?.nome}</div>
                        <div className="cargo">{usuario?.cargo}</div>
                    </div>
                </div>
            </aside>

            <Offcanvas show={aberto} onHide={() => setAberto(false)} className="sidebar d-lg-none">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>construcasa</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Menu onClick={() => setAberto(false)} />
                </Offcanvas.Body>
            </Offcanvas>

            <main className="flex-grow-1 p-3 p-lg-4">
                <Button
                    variant="outline-light"
                    size="sm"
                    className="d-lg-none mb-3"
                    onClick={() => setAberto(true)}
                >
                    ☰ Menu
                </Button>
                <Outlet />
            </main>
        </div>
    );
}