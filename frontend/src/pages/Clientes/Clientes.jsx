import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Form } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [ordem, setOrdem] = useState("nome");

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

  async function excluir(cliente) {
    if (!window.confirm(`Excluir o cliente "${cliente.nome}"?`)) return;

    try {
      const resp = await fetch(`${API}/clientes/${cliente.id_cliente}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error();
      setClientes((atuais) =>
        atuais.filter((c) => c.id_cliente !== cliente.id_cliente)
      );
      setErro("");
    } catch {
      setErro("Não foi possível excluir o cliente.");
    }
  }

  function editar(cliente) {
    navigate(`/clientes/${cliente.id_cliente}/editar`);
  }

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

  function sobrenome(nome) {
    const partes = nome.trim().split(/\s+/);
    return partes.length > 1 ? partes[partes.length - 1] : "";
  }

  function ddd(telefone) {
    let digitos = String(telefone || "").replace(/\D/g, "");
    if (digitos.startsWith("55") && digitos.length >= 12) {
      digitos = digitos.slice(2);
    }
    return digitos.slice(0, 2);
  }

  const comparar = (a, b) => a.localeCompare(b, "pt-BR");

  const ordenados = [...filtrados].sort((a, b) => {
    if (ordem === "recentes") {
      return b.id_cliente - a.id_cliente;
    }
    if (ordem === "sobrenome") {
      return comparar(sobrenome(a.nome), sobrenome(b.nome)) || comparar(a.nome, b.nome);
    }
    if (ordem === "ddd") {
      return comparar(ddd(a.telefone), ddd(b.telefone)) || comparar(a.nome, b.nome);
    }
    return comparar(a.nome, b.nome);
  });

  const ROTULOS_ORDEM = {
    recentes: "Adicionados recentemente",
    nome: "Nome",
    sobrenome: "Sobrenome",
    ddd: "DDD",
  };

  return (
    <div className="pg">
      <h2 className="pg-titulo">Clientes</h2>

      <div className="pg-stats">
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Clientes cadastrados</div>
          <div className="pg-stat-valor">{clientes.length}</div>
        </div>
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Cadastrados neste mês</div>
          <div className="pg-stat-valor">{doMes.length}</div>
        </div>
      </div>

      <h3 className="pg-subtitulo">Lista de clientes</h3>
      <div className="pg-barra">
        <Dropdown>
          <Dropdown.Toggle variant="link" className="pg-filtro">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filtros: {ROTULOS_ORDEM[ordem]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.entries(ROTULOS_ORDEM).map(([chave, rotulo]) => (
              <Dropdown.Item
                key={chave}
                active={ordem === chave}
                onClick={() => setOrdem(chave)}
              >
                {rotulo}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Form.Control
          className="pg-busca"
          placeholder="Buscar nome, email, CPF/CNPJ, telefone"
          aria-label="Buscar clientes"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button
          variant="link"
          className="pg-novo"
          aria-label="Novo cliente"
          onClick={() => navigate("/clientes/novo")}
        >
          +
        </Button>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}
      {!erro && filtrados.length === 0 && (
        <div className="pg-vazio">Nenhum cliente encontrado.</div>
      )}

      <div className="pg-lista">
        {ordenados.map((c) => (
          <div key={c.id_cliente} className="pg-item">
            <div>
              <div className="pg-item-nome">{c.nome}</div>
              <div className="pg-item-sub">
                {c.telefone}
                {c.cpf_cnpj ? " · CPF/CNPJ informado" : ""}
              </div>
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="menu-pontos pg-pontos"
                aria-label={`Opções de ${c.nome}`}
              >
                •••
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => editar(c)}>Editar</Dropdown.Item>
                <Dropdown.Item onClick={() => excluir(c)}>Excluir</Dropdown.Item>
                <Dropdown.Item>Fechar</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>
    </div>
  );
}
