import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

const API = "http://localhost:3001";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`${API}/clientes`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setClientes)
      .catch(() =>
        setErro("Não foi possível carregar os clientes. Verifique se o servidor está ligado.")
      );
  }, []);

  const agora = new Date();
  const doMes = clientes.filter((c) => {
    const data = new Date(c.created_at || c.createdAt);
    return (
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    );
  });

  const filtrados = clientes.filter((c) =>
    [c.nome, c.email, c.cpf_cnpj, c.telefone]
      .filter(Boolean)
      .some((campo) => String(campo).toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div>
      <h2>Clientes</h2>

      <div className="d-flex gap-3 my-3">
        <div className="card-cc p-3 text-center">
          <div className="small">Clientes cadastrados:</div>
          <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
            {clientes.length}
          </div>
        </div>
        <div className="card-cc p-3 text-center">
          <div className="small">Cadastrados neste mês:</div>
          <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
            {doMes.length}
          </div>
        </div>
      </div>

      <h4>Lista de clientes:</h4>
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          placeholder="Buscar nome, email, CPF/CNPJ, telefone"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="danger" onClick={() => navigate("/clientes/novo")}>
          +
        </Button>
      </div>

      {erro && <div className="text-danger">{erro}</div>}
      {!erro && filtrados.length === 0 && <div>Nenhum cliente encontrado.</div>}

      {filtrados.map((c) => (
        <div key={c.id_cliente} className="card-cc p-3 mb-2">
          <div className="fs-5 fw-bold">{c.nome}</div>
          <div className="small">
            {c.telefone}
            {c.cpf_cnpj ? " · CPF/CNPJ informado" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}