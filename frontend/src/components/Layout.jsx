import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import "./Layout.css";

const menu = [
    { nome: "Início", rota: "/" },
    { nome: "Clientes", rota: "/clientes" },
    { nome: "Categorias", rota: "/categorias" },
    { nome: "Produtos", rota: "/produtos" },
    { nome: "Funcionários", rota: "/funcionarios" },
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

// Coloque o arquivo da logo em frontend/public/logo.jpg (ou mude o caminho aqui).
// Se o arquivo não existir, aparece o texto "construcasa" no lugar.
const LOGO = "/logo.jpg";

function Logo({ altura }) {
    const [falhou, setFalhou] = useState(false);

    if (falhou) return <span className="logo-texto">construcasa</span>;

    return (
        <img
            src={LOGO}
            alt="construcasa"
            className="logo-menu"
            style={{ height: altura }}
            onError={() => setFalhou(true)}
        />
    );
}

function IconeMenu() {
    return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
                d="M4 6h16M4 12h16M4 18h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Layout() {
    const [aberto, setAberto] = useState(false);
    // No computador o menu pode ser ocultado; a escolha fica guardada no navegador
    const [recolhido, setRecolhido] = useState(() => {
        try {
            return localStorage.getItem("menuRecolhido") === "1";
        } catch {
            return false;
        }
    });
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    function alternarMenu() {
        const novo = !recolhido;
        setRecolhido(novo);
        try {
            localStorage.setItem("menuRecolhido", novo ? "1" : "0");
        } catch {
            // sem localStorage, só não lembra da escolha
        }
    }

    return (
        <div className="d-flex min-vh-100">
            {!recolhido && (
                <aside className="sidebar d-none d-lg-flex flex-column p-3">
                    <h1 className="h5 text-center mb-4">
                        <Logo altura={80} />
                    </h1>

                    <Menu />

                    <div className="mt-auto usuario-card">
                        <div className="avatar" />

                        <div>
                            <div className="nome">{usuario?.nome}</div>

                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-2"
                                onClick={handleLogout}
                            >
                                Sair
                            </Button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="menu-toggle mx-auto mt-3"
                        aria-label="Ocultar menu"
                        onClick={alternarMenu}
                    >
                        <IconeMenu />
                    </button>
                </aside>
            )}

            <Offcanvas show={aberto} onHide={() => setAberto(false)} className="sidebar d-lg-none">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>
                        <Logo altura={40} />
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Menu onClick={() => setAberto(false)} />
                </Offcanvas.Body>
            </Offcanvas>

            <main className="flex-grow-1 p-3 p-lg-4">
                <div className="barra-menu d-lg-none">
                    <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => setAberto(true)}
                    >
                        ☰ Menu
                    </Button>
                </div>
                {recolhido && (
                    <button
                        type="button"
                        className="menu-toggle menu-toggle--mostrar"
                        aria-label="Mostrar menu"
                        onClick={alternarMenu}
                    >
                        <IconeMenu />
                    </button>
                )}
                <Outlet />
            </main>
        </div>
    );
}