import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Form } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";

const ROTULOS_ORDEM = {
  recentes: "Adicionados recentemente",
  nome: "Nome",
  cargo: "Cargo",
  perfil: "Perfil de acesso",
};

const comparar = (a, b) => String(a || "").localeCompare(String(b || ""), "pt-BR");

export default function Funcionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [ordem, setOrdem] = useState("nome");

  useEffect(() => {
    fetch(`${API}/funcionarios`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setFuncionarios)
      .catch(() =>
        setErro("Não foi possível carregar os funcionários. Verifique se o servidor está ligado.")
      );

    // Usado só para mostrar o nome do perfil; se falhar, a lista continua funcionando
    fetch(`${API}/roles`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  function nomePerfil(f) {
    if (f.role?.nome) return f.role.nome;
    const role = roles.find((r) => (r.id_role ?? r.id) === f.id_role);
    return role ? role.nome : "";
  }

  async function excluir(funcionario) {
    if (!window.confirm(`Excluir o funcionário "${funcionario.nome}"?`)) return;

    try {
      const resp = await fetch(`${API}/funcionarios/${funcionario.id_funcionario}`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível excluir o funcionário.");
      }
      setFuncionarios((atuais) =>
        atuais.filter((f) => f.id_funcionario !== funcionario.id_funcionario)
      );
      setErro("");
    } catch (e) {
      setErro(
        e instanceof TypeError
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : e.message
      );
    }
  }

  function editar(funcionario) {
    navigate(`/funcionarios/${funcionario.id_funcionario}/editar`);
  }

  const ativos = funcionarios.filter((f) => f.ativo !== false);

  const termo = busca.trim().toLowerCase();
  const termoDigitos = termo.replace(/\D/g, "");

  const filtrados = funcionarios.filter((f) => {
    const achouTexto = [f.nome, f.cargo, nomePerfil(f)]
      .filter(Boolean)
      .some((campo) => String(campo).toLowerCase().includes(termo));
    // CPF é guardado só com dígitos; permite buscar digitando com pontos e traço
    const achouCpf = termoDigitos !== "" && String(f.cpf || "").includes(termoDigitos);
    return achouTexto || achouCpf;
  });

  const ordenados = [...filtrados].sort((a, b) => {
    if (ordem === "recentes") {
      return b.id_funcionario - a.id_funcionario;
    }
    if (ordem === "cargo") {
      return comparar(a.cargo, b.cargo) || comparar(a.nome, b.nome);
    }
    if (ordem === "perfil") {
      return comparar(nomePerfil(a), nomePerfil(b)) || comparar(a.nome, b.nome);
    }
    return comparar(a.nome, b.nome);
  });

  return (
    <div className="pg">
      <h2 className="pg-titulo">Funcionários</h2>

      <div className="pg-stats">
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Funcionários cadastrados</div>
          <div className="pg-stat-valor">{funcionarios.length}</div>
        </div>
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Funcionários ativos</div>
          <div className="pg-stat-valor">{ativos.length}</div>
        </div>
      </div>

      <h3 className="pg-subtitulo">Lista de funcionários</h3>
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
          placeholder="Buscar nome, CPF, cargo"
          aria-label="Buscar funcionários"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button
          variant="link"
          className="pg-novo"
          aria-label="Novo funcionário"
          onClick={() => navigate("/funcionarios/novo")}
        >
          +
        </Button>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}
      {!erro && filtrados.length === 0 && (
        <div className="pg-vazio">Nenhum funcionário encontrado.</div>
      )}

      <div className="pg-lista">
        {ordenados.map((f) => (
          <div key={f.id_funcionario} className="pg-item">
            <div>
              <div className="pg-item-nome">{f.nome}</div>
              <div className="pg-item-sub">
                {[f.cargo, nomePerfil(f), f.ativo === false ? "Inativo" : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="menu-pontos pg-pontos"
                aria-label={`Opções de ${f.nome}`}
              >
                •••
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => editar(f)}>Editar</Dropdown.Item>
                <Dropdown.Item onClick={() => excluir(f)}>Excluir</Dropdown.Item>
                <Dropdown.Item>Fechar</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>
    </div>
  );
}