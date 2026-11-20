import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";

const VAZIO = {
  nome: "", telefone: "", cpf_cnpj: "", email: "",
  rua: "", numero: "", bairro: "", complemento: "", cidade: "", uf: "",
};

function vazioParaNull(valor) {
  const v = valor.trim();
  return v === "" ? null : v;
}

export default function CadastrarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);

  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando) return;

    fetch(`${API}/clientes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((c) => {
        setForm({
          nome: c.nome ?? "",
          telefone: c.telefone ?? "",
          cpf_cnpj: c.cpf_cnpj ?? "",
          email: c.email ?? "",
          rua: c.endereco?.rua ?? "",
          numero: c.endereco?.numero ?? "",
          bairro: c.endereco?.bairro ?? "",
          complemento: c.endereco?.complemento ?? "",
          cidade: c.endereco?.cidade ?? "",
          uf: "",
        });
      })
      .catch(() => setErro("Não foi possível carregar os dados do cliente."));
  }, [id, editando]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    if (!form.nome.trim() || !form.telefone.trim()) {
      setErro("Nome e telefone são obrigatórios.");
      return;
    }

    const temEndereco = form.rua || form.numero || form.bairro || form.cidade;
    if (temEndereco && !(form.rua && form.numero && form.bairro && form.cidade)) {
      setErro("Para informar o endereço, preencha rua, número, bairro e cidade.");
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      cpf_cnpj: vazioParaNull(form.cpf_cnpj.replace(/\D/g, "")),
      email: vazioParaNull(form.email),
      endereco: temEndereco
        ? {
            rua: form.rua.trim(),
            numero: form.numero.trim(),
            bairro: form.bairro.trim(),
            cidade: form.cidade.trim(),
            complemento: vazioParaNull(form.complemento),
          }
        : null,
    };

    setErro("");
    setSalvando(true);
    try {
      const resp = await fetch(
        editando ? `${API}/clientes/${id}` : `${API}/clientes`,
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        }
      );
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível salvar o cliente.");
      }
      navigate("/clientes");
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pg">
      <h2 className="pg-titulo">{editando ? "Editar cliente" : "Cadastrar cliente"}</h2>

      <div className="pg-form">
        <Row className="g-3">
          <Form.Group as={Col} md={9} controlId="nome">
            <Form.Label>Nome *</Form.Label>
            <Form.Control name="nome" value={form.nome} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="telefone">
            <Form.Label>Telefone *</Form.Label>
            <Form.Control name="telefone" value={form.telefone} onChange={alterar} />
          </Form.Group>

          <Form.Group as={Col} md={5} controlId="cpf_cnpj">
            <Form.Label>CPF / CNPJ</Form.Label>
            <Form.Control name="cpf_cnpj" value={form.cpf_cnpj} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={7} controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control name="email" value={form.email} onChange={alterar} />
          </Form.Group>

          <Form.Group as={Col} md={7} controlId="rua">
            <Form.Label>Rua</Form.Label>
            <Form.Control name="rua" value={form.rua} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={2} controlId="numero">
            <Form.Label>Número</Form.Label>
            <Form.Control name="numero" value={form.numero} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="bairro">
            <Form.Label>Bairro</Form.Label>
            <Form.Control name="bairro" value={form.bairro} onChange={alterar} />
          </Form.Group>

          <Form.Group as={Col} md={4} controlId="complemento">
            <Form.Label>Complemento</Form.Label>
            <Form.Control name="complemento" value={form.complemento} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={5} controlId="cidade">
            <Form.Label>Cidade</Form.Label>
            <Form.Control name="cidade" value={form.cidade} onChange={alterar} />
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="uf">
            <Form.Label>UF</Form.Label>
            <Form.Control name="uf" value={form.uf} onChange={alterar} />
          </Form.Group>
        </Row>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}

      <div className="pg-acoes">
        <Button as={Link} to="/clientes" variant="secondary" className="pg-btn pg-btn-sec">
          Cancelar
        </Button>
        <Button variant="danger" className="pg-btn pg-btn-pri" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar Cliente"}
        </Button>
      </div>
    </div>
  );
}
