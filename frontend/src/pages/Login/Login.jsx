import { useState } from "react";
import Input from "../../components/Input.jsx";
import Button from "@mui/material/Button";
import "./Login.css";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    function handleForm(e) {
        e.preventDefault();

        console.log("HandleForm");
    }

    return (
        <div className="login-container">
            <form onSubmit={handleForm} className="login-form">
                <h2>Bem-vindo(a) de volta!</h2>

                <div className="login-field">
                    <label>Usuário:</label>
                    <Input dado={usuario}setDado={setUsuario}/>
                </div>

                <div className="login-field">
                    <label>Senha:</label>
                    <Input dado={senha} setDado={setSenha}/>
                </div>

                <Button variant="contained" type="submit" fullWidth>Entrar </Button>
            </form> 
        </div>
    );
}