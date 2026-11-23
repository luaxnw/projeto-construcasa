import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";

const ROTULOS_ORDEM = {
  nome: "Nome",
  ativa: "Situação",
};

const FORM_VAZIO = { nome: "", descricao: "", ativa: true };

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("nome");
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try {
      const resp = await fetch(`${API}/categorias`);
      if (!resp.ok) throw new Error();
      setCategorias(await resp.json());
      setErro("");
    } catch {
      setErro("Não foi possível carregar as categorias. Verifique se o servidor está ligado.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErroForm("");
    setModalAberto(true);
  }

  function abrirEdicao(categoria) {
    setEditandoId(categoria.id_categoria);
    setForm({
      nome: categoria.nome,
      descricao: categoria.descricao || "",
      ativa: categoria.ativa,
    });
    setErroForm("");
    setModalAberto(true);
  }

  async function salvar() {
    if (!form.nome.trim()) {
      setErroForm("O nome é obrigatório.");
      return;
    }

    setSalvando(true);
    setErroForm("");
    try {
      const resp = await fetch(
        editandoId ? `${API}/categorias/${editandoId}` : `${API}/categorias`,
        {
          method: editandoId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: form.nome.trim(),
            descricao: form.descricao.trim(),
            ativa: form.ativa,
          }),
        }
      );
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível salvar a categoria.");
      }
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErroForm(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(categoria) {
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return;

    try {
      const resp = await fetch(`${API}/categorias/${categoria.id_categoria}`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível excluir a categoria.");
      }
      setCategorias((atuais) =>
        atuais.filter((c) => c.id_categoria !== categoria.id_categoria)
      );
      setErro("");
    } catch (e) {
      setErro(e.message);
    }
  }

  const filtradas = categorias.filter((c) =>
    [c.nome, c.descricao].some((campo) =>
      String(campo || "").toLowerCase().includes(busca.toLowerCase())
    )
  );

  const ordenadas = [...filtradas].sort((a, b) => {
    if (ordem === "ativa") return Number(b.ativa) - Number(a.ativa);
    return String(a.nome).localeCompare(String(b.nome), "pt-BR");
  });

  const totalAtivas = categorias.filter((c) => c.ativa).length;

  return (
    <div className="pg">
      <h2 className="pg-titulo">Categorias</h2>

      <div className="pg-stats">
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Categorias cadastradas</div>
          <div className="pg-stat-valor">{categorias.length}</div>
        </div>
        <div className="pg-stat">
          <div className="pg-stat-rotulo">Categorias ativas</div>
          <div className="pg-stat-valor">{totalAtivas}</div>
        </div>
      </div>

      <h3 className="pg-subtitulo">Lista de categorias</h3>
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
          placeholder="Buscar nome ou descrição"
          aria-label="Buscar categorias"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button
          variant="link"
          className="pg-novo"
          aria-label="Nova categoria"
          onClick={abrirNovo}
        >
          +
        </Button>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}
      {!erro && filtradas.length === 0 && (
        <div className="pg-vazio">Nenhuma categoria encontrada.</div>
      )}

      <div className="pg-lista">
        {ordenadas.map((c) => (
          <div key={c.id_categoria} className="pg-item">
            <div>
              <div className="pg-item-nome">{c.nome}</div>
              <div className="pg-item-sub">
                {c.descricao || "Sem descrição"} · {c.ativa ? "Ativa" : "Inativa"}
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
                <Dropdown.Item onClick={() => abrirEdicao(c)}>Editar</Dropdown.Item>
                <Dropdown.Item onClick={() => excluir(c)}>Excluir</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>

      <Modal
        show={modalAberto}
        onHide={() => setModalAberto(false)}
        centered
        className="pg-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            {editandoId ? "Editar categoria" : "Cadastrar categoria"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="categoria-nome">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="categoria-descricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </Form.Group>
          <Form.Check
            type="switch"
            id="categoria-ativa"
            label="Categoria ativa"
            checked={form.ativa}
            onChange={(e) => setForm({ ...form, ativa: e.target.checked })}
          />
          {erroForm && <div className="pg-aviso" role="alert">{erroForm}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="pg-btn pg-btn-sec"
            onClick={() => setModalAberto(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="pg-btn pg-btn-pri"
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
