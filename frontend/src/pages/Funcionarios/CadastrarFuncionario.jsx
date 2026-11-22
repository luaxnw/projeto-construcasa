import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";

const VAZIO = {
  nome: "", cpf: "", cargo: "", id_role: "", senha: "",
};

const SENHA_MINIMA = 8;

export default function CadastrarFuncionario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);

  const [form, setForm] = useState(VAZIO);
  const [roles, setRoles] = useState([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Perfis de acesso para o campo "Perfil de acesso"
  useEffect(() => {
    fetch(`${API}/roles`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setRoles)
      .catch(() => setErro("Não foi possível carregar os perfis de acesso."));
  }, []);

  // Na edição, carrega os dados do funcionário (a senha nunca vem do servidor)
  useEffect(() => {
    if (!editando) return;

    fetch(`${API}/funcionarios/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((f) => {
        setForm({
          nome: f.nome ?? "",
          cpf: f.cpf ?? "",
          cargo: f.cargo ?? "",
          id_role: f.id_role != null ? String(f.id_role) : "",
          senha: "",
        });
      })
      .catch(() => setErro("Não foi possível carregar os dados do funcionário."));
  }, [id, editando]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    const cpf = form.cpf.replace(/\D/g, "");

    if (!form.nome.trim() || !cpf || !form.cargo.trim() || !form.id_role) {
      setErro("Preencha todos os campos obrigatórios (*).");
      return;
    }
    if (cpf.length !== 11) {
      setErro("O CPF deve ter 11 dígitos.");
      return;
    }
    if (!editando && !form.senha) {
      setErro("Informe uma senha para o funcionário.");
      return;
    }
    if (form.senha && form.senha.length < SENHA_MINIMA) {
      setErro(`A senha deve ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      cpf,
      cargo: form.cargo.trim(),
      id_role: Number(form.id_role),
    };
    // Na edição, senha em branco = manter a senha atual
    if (form.senha) dados.senha = form.senha;

    setErro("");
    setSalvando(true);
    try {
      const resp = await fetch(
        editando ? `${API}/funcionarios/${id}` : `${API}/funcionarios`,
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        }
      );
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível salvar o funcionário.");
      }
      navigate("/funcionarios");
    } catch (e) {
      setErro(
        e instanceof TypeError
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : e.message
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pg">
      <h2 className="pg-titulo">{editando ? "Editar funcionário" : "Cadastrar funcionário"}</h2>

      <div className="pg-form">
        <Row className="g-3">
          <Form.Group as={Col} md={8} controlId="nome">
            <Form.Label>Nome *</Form.Label>
            <Form.Control name="nome" value={form.nome} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="cpf">
            <Form.Label>CPF *</Form.Label>
            <Form.Control name="cpf" value={form.cpf} onChange={alterar} inputMode="numeric" />
          </Form.Group>

          <Form.Group as={Col} md={4} controlId="cargo">
            <Form.Label>Cargo *</Form.Label>
            <Form.Control name="cargo" value={form.cargo} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="id_role">
            <Form.Label>Perfil de acesso *</Form.Label>
            <Form.Select name="id_role" value={form.id_role} onChange={alterar}>
              <option value="">Selecione...</option>
              {roles.map((r) => (
                <option key={r.id_role ?? r.id} value={r.id_role ?? r.id}>
                  {r.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="senha">
            <Form.Label>{editando ? "Nova senha" : "Senha *"}</Form.Label>
            <Form.Control
              type="password"
              name="senha"
              value={form.senha}
              onChange={alterar}
              autoComplete="new-password"
              placeholder={editando ? "Deixe em branco para manter" : ""}
            />
          </Form.Group>
        </Row>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}

      <div className="pg-acoes">
        <Button as={Link} to="/funcionarios" variant="secondary" className="pg-btn pg-btn-sec">
          Cancelar
        </Button>
        <Button variant="danger" className="pg-btn pg-btn-pri" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar Funcionário"}
        </Button>
      </div>
    </div>
  );
}