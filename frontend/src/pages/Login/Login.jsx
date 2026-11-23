
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/Input.jsx";
import Button from "@mui/material/Button";
import "./Login.css";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const { usuario: usuarioLogado, login } = useAuth();

    async function handleForm(e) {
        e.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            const resposta = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: usuario,
                    password: senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || dados.erro || "Falha no login"
                );
            }

            if (!dados.token || !dados.usuario) {
                throw new Error("Resposta de login incompleta");
            }

            localStorage.setItem("token", dados.token);

            login({
                id: dados.usuario.id,
                nome: dados.usuario.nome,
                role: dados.usuario.role
            });

        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    if (usuarioLogado) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="login-container">
            <form onSubmit={handleForm} className="login-form">
                <h2>Bem-vindo(a) de volta!</h2>

                <div className="login-field">
                    <label>Usuário:</label>
                    <Input dado={usuario} setDado={setUsuario} />
                </div>

                <div className="login-field">
                    <label>Senha:</label>
                    <Input dado={senha} setDado={setSenha} />
                </div>

                {erro && <p className="login-erro">{erro}</p>}

                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={carregando}
                >
                    {carregando ? "Entrando..." : "Entrar"}
                </Button>
            </form>
        </div>
    );
}
