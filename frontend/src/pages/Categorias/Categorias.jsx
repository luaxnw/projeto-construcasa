import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";

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
    <div>
      <h2>Categorias</h2>

      <div className="d-flex gap-3 my-3">
        <div className="card-cc p-3 text-center">
          <div className="small">Categorias cadastradas:</div>
          <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
            {categorias.length}
          </div>
        </div>
        <div className="card-cc p-3 text-center">
          <div className="small">Categorias ativas:</div>
          <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
            {totalAtivas}
          </div>
        </div>
      </div>

      <h4>Lista de categorias:</h4>
      <div className="d-flex gap-2 mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="sm">
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
          placeholder="Buscar nome ou descrição"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button variant="danger" onClick={abrirNovo}>
          +
        </Button>
      </div>

      {erro && <div className="text-danger mb-2">{erro}</div>}
      {!erro && filtradas.length === 0 && <div>Nenhuma categoria encontrada.</div>}

      {ordenadas.map((c) => (
        <div
          key={c.id_categoria}
          className="card-cc p-3 mb-2 d-flex justify-content-between align-items-start"
        >
          <div>
            <div className="fs-5 fw-bold">{c.nome}</div>
            <div className="small">
              {c.descricao || "Sem descrição"} · {c.ativa ? "Ativa" : "Inativa"}
            </div>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="text-white text-decoration-none p-0"
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

      <Modal show={modalAberto} onHide={() => setModalAberto(false)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            {editandoId ? "Editar categoria" : "Cadastrar categoria"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Nome *</Form.Label>
          <Form.Control
            className="mb-3"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            className="mb-3"
            as="textarea"
            rows={2}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          <Form.Check
            type="switch"
            label="Categoria ativa"
            checked={form.ativa}
            onChange={(e) => setForm({ ...form, ativa: e.target.checked })}
          />
          {erroForm && <div className="text-danger mt-2">{erroForm}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalAberto(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}