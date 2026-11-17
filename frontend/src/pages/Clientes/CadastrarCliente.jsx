import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";

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
    <div>
      <h2>{editando ? "Editar cliente" : "Cadastrar cliente"}</h2>

      <div className="card-cc p-3 my-3">
        <Row className="g-3">
          <Col md={9}>
            <Form.Label>Nome *</Form.Label>
            <Form.Control name="nome" value={form.nome} onChange={alterar} />
          </Col>
          <Col md={3}>
            <Form.Label>Telefone *</Form.Label>
            <Form.Control name="telefone" value={form.telefone} onChange={alterar} />
          </Col>

          <Col md={5}>
            <Form.Label>CPF / CNPJ</Form.Label>
            <Form.Control name="cpf_cnpj" value={form.cpf_cnpj} onChange={alterar} />
          </Col>
          <Col md={7}>
            <Form.Label>E-mail</Form.Label>
            <Form.Control name="email" value={form.email} onChange={alterar} />
          </Col>

          <Col md={7}>
            <Form.Label>Rua</Form.Label>
            <Form.Control name="rua" value={form.rua} onChange={alterar} />
          </Col>
          <Col md={2}>
            <Form.Label>Número</Form.Label>
            <Form.Control name="numero" value={form.numero} onChange={alterar} />
          </Col>
          <Col md={3}>
            <Form.Label>Bairro</Form.Label>
            <Form.Control name="bairro" value={form.bairro} onChange={alterar} />
          </Col>

          <Col md={4}>
            <Form.Label>Complemento</Form.Label>
            <Form.Control name="complemento" value={form.complemento} onChange={alterar} />
          </Col>
          <Col md={5}>
            <Form.Label>Cidade</Form.Label>
            <Form.Control name="cidade" value={form.cidade} onChange={alterar} />
          </Col>
          <Col md={3}>
            <Form.Label>UF</Form.Label>
            <Form.Control name="uf" value={form.uf} onChange={alterar} />
          </Col>
        </Row>
      </div>

      {erro && <div className="text-danger mb-2">{erro}</div>}

      <div className="d-flex justify-content-end gap-2">
        <Button as={Link} to="/clientes" variant="secondary">
          Cancelar
        </Button>
        <Button variant="danger" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar Cliente"}
        </Button>
      </div>
    </div>
  );
}