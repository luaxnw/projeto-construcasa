import { useState } from "react";
import Input from "../components/Input";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    function handleForm(e) {
        e.preventDefault();
    }

    return (
        <div className="login-container">
            <form onSubmit={handleForm}>
                <label>
                    Usuário: <Input dado={usuario} setDado={setUsuario}></Input>
                    Senha: <Input dado={senha} setDado={setSenha}></Input>
                </label>
            </form>
        </div>
    );
}