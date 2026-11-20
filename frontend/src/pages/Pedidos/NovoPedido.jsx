import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const API = "http://localhost:3001";

// TODO(login): trocar pelo funcionário logado quando o login existir
const ID_FUNCIONARIO_TESTE = 1;

const CANAIS = ["WhatsApp", "Presencial"];

const FORMAS_PAGAMENTO = [
  { valor: "pix", rotulo: "PIX" },
  { valor: "dinheiro", rotulo: "Dinheiro" },
  { valor: "cartao_debito", rotulo: "Cartão de débito" },
  { valor: "cartao_credito", rotulo: "Cartão de crédito" },
];

const FORM_VAZIO = {
  id_cliente: "",
  canal: "WhatsApp",
  forma_pagamento: "",
  tipo_entrega: "",
};

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Aceita "1,3" e "1.3"; texto vazio vira NaN
function lerQuantidade(texto) {
  const limpo = String(texto).trim().replace(",", ".");
  return limpo === "" ? NaN : Number(limpo);
}

// Mensagens do caso de teste CT01
function erroQuantidade(item) {
  if (String(item.quantidade).trim() === "")
    return "Informe a quantidade de produtos";

  const numero = lerQuantidade(item.quantidade);

  if (!Number.isInteger(numero))
    return "A quantidade deve ser um número inteiro";
  if (numero <= 0)
    return `A quantidade do produto ${item.nome} deve ser um número positivo`;
  if (numero > item.estoque)
    return `Saldo insuficiente no estoque: ${item.nome} | ${numero} unidades solicitadas e ${item.estoque} em estoque`;

  return "";
}

export default function NovoPedido() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [aviso, setAviso] = useState(null);
  const [erroCarga, setErroCarga] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function carregar() {
    try {
      const [respProdutos, respClientes] = await Promise.all([
        fetch(`${API}/produtos`),
        fetch(`${API}/clientes`),
      ]);
      if (!respProdutos.ok || !respClientes.ok) throw new Error();

      const listaProdutos = await respProdutos.json();
      setProdutos(listaProdutos);
      setClientes(await respClientes.json());

      // Mantém o estoque do carrinho igual ao do banco
      setCarrinho((atual) =>
        atual.map((item) => {
          const produto = listaProdutos.find(
            (p) => p.id_produto === item.id_produto
          );
          return produto ? { ...item, estoque: produto.qtd_estoque } : item;
        })
      );
      setErroCarga("");
    } catch {
      setErroCarga(
        "Não foi possível carregar produtos e clientes. Verifique se o servidor está ligado."
      );
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function adicionar(produto) {
    setAviso(null);
    setCarrinho((atual) => {
      const existente = atual.find((i) => i.id_produto === produto.id_produto);

      if (existente) {
        return atual.map((i) =>
          i.id_produto === produto.id_produto
            ? { ...i, quantidade: String((Number(i.quantidade) || 0) + 1) }
            : i
        );
      }

      return [
        ...atual,
        {
          id_produto: produto.id_produto,
          nome: produto.nome,
          unidade: produto.unidades_medida?.sigla || "",
          preco: Number(produto.preco_venda),
          estoque: produto.qtd_estoque,
          quantidade: "1",
          tocado: false,
        },
      ];
    });
  }

  function alterarQuantidade(id, valor) {
    setCarrinho((atual) =>
      atual.map((i) => (i.id_produto === id ? { ...i, quantidade: valor } : i))
    );
  }

  function marcarTocado(id) {
    setCarrinho((atual) =>
      atual.map((i) => (i.id_produto === id ? { ...i, tocado: true } : i))
    );
  }

  function remover(id) {
    setCarrinho((atual) => atual.filter((i) => i.id_produto !== id));
  }

  async function registrar() {
    setAviso(null);
    setCarrinho((atual) => atual.map((i) => ({ ...i, tocado: true })));

    const faltando = [];
    if (!form.id_cliente) faltando.push("Selecione o cliente");
    if (carrinho.length === 0)
      faltando.push("Adicione pelo menos um produto ao pedido");
    if (carrinho.some((i) => String(i.quantidade).trim() === ""))
      faltando.push("Informe a quantidade de produtos");
    if (!form.forma_pagamento) faltando.push("Informe a forma de pagamento");
    if (!form.tipo_entrega)
      faltando.push("Informe se será entregue ou retirado");
    if (
      form.tipo_entrega === "entrega" &&
      clienteSelecionado &&
      !clienteSelecionado.id_endereco
    )
      faltando.push(
        "O cliente não tem endereço cadastrado. Cadastre o endereço ou escolha retirada"
      );

    if (faltando.length > 0) {
      setAviso({ tipo: "erro", titulo: "Informações incompletas:", itens: faltando });
      return;
    }

    if (carrinho.some((i) => erroQuantidade(i))) {
      setAviso({
        tipo: "erro",
        titulo: "Corrija as quantidades indicadas nos itens do pedido.",
        itens: [],
      });
      return;
    }

    setEnviando(true);
    try {
      const resp = await fetch(`${API}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: Number(form.id_cliente),
          id_funcionario: ID_FUNCIONARIO_TESTE,
          forma_pagamento: form.forma_pagamento,
          tipo_entrega: form.tipo_entrega,
          observacoes: `Canal: ${form.canal}`,
          itens: carrinho.map((i) => ({
            id_produto: i.id_produto,
            quantidade: lerQuantidade(i.quantidade),
          })),
        }),
      });

      const retorno = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const mensagens =
          Array.isArray(retorno.detalhes) && retorno.detalhes.length > 0
            ? retorno.detalhes.map((d) => d.mensagem)
            : [retorno.erro || "Não foi possível registrar o pedido."];
        setAviso({ tipo: "erro", titulo: "Pedido não registrado:", itens: mensagens });
        carregar(); // o estoque pode ter mudado
        return;
      }

      setAviso({
        tipo: "sucesso",
        titulo: `Pedido #${retorno.pedido.id_pedido} registrado com sucesso. Total: ${formatarPreco(retorno.pedido.valor_total)}`,
        itens: [],
      });
      setCarrinho([]);
      setForm(FORM_VAZIO);
      carregar();
    } catch {
      setAviso({
        tipo: "erro",
        titulo: "Não foi possível conectar ao servidor. Verifique se ele está ligado.",
        itens: [],
      });
    } finally {
      setEnviando(false);
    }
  }

  const termo = busca.toLowerCase();
  const disponiveis = produtos.filter(
    (p) =>
      p.ativo &&
      [p.nome, p.categoria?.nome].some((campo) =>
        String(campo || "").toLowerCase().includes(termo)
      )
  );

  const clienteSelecionado = clientes.find(
    (c) => String(c.id_cliente) === form.id_cliente
  );
  const endereco = clienteSelecionado?.enderecos;
  const textoEndereco = endereco
    ? `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`
    : "Endereço do cadastro do cliente";

  const total = carrinho.reduce((soma, item) => {
    const quantidade = lerQuantidade(item.quantidade);
    return Number.isInteger(quantidade) && quantidade > 0
      ? soma + item.preco * quantidade
      : soma;
  }, 0);

  return (
    <div>
      <h2>Registrar pedido</h2>
      <div className="small mb-3">
        Pesquise por nome ou categoria, confira estoque e preço e adicione ao
        pedido.
      </div>

      {erroCarga && <div className="text-danger mb-2">{erroCarga}</div>}

      <Row className="g-3">
        <Col lg={6}>
          <Form.Control
            className="mb-3"
            placeholder="Buscar por nome ou categoria"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {!erroCarga && disponiveis.length === 0 && (
              <div>Nenhum produto encontrado.</div>
            )}

            {disponiveis.map((p) => (
              <div
                key={p.id_produto}
                className="card-cc p-3 mb-2 d-flex justify-content-between align-items-center gap-2"
              >
                <div>
                  <div className="fw-bold">{p.nome}</div>
                  <div className="small">
                    {p.categoria?.nome} · {p.unidades_medida?.nome} ·{" "}
                    {formatarPreco(p.preco_venda)} · Estoque {p.qtd_estoque}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={p.qtd_estoque === 0}
                  onClick={() => adicionar(p)}
                >
                  {p.qtd_estoque === 0 ? "Sem estoque" : "Adicionar"}
                </Button>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={6}>
          <div className="card-cc p-3">
            <Form.Label>Cliente *</Form.Label>
            <Form.Select
              className="mb-3"
              value={form.id_cliente}
              onChange={(e) => setForm({ ...form, id_cliente: e.target.value })}
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nome} · {c.telefone}
                </option>
              ))}
            </Form.Select>

            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Label>Canal de atendimento</Form.Label>
                <Form.Select
                  value={form.canal}
                  onChange={(e) => setForm({ ...form, canal: e.target.value })}
                >
                  {CANAIS.map((canal) => (
                    <option key={canal} value={canal}>
                      {canal}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={6}>
                <Form.Label>Forma de pagamento *</Form.Label>
                <Form.Select
                  value={form.forma_pagamento}
                  onChange={(e) =>
                    setForm({ ...form, forma_pagamento: e.target.value })
                  }
                >
                  <option value="">Selecione...</option>
                  {FORMAS_PAGAMENTO.map((f) => (
                    <option key={f.valor} value={f.valor}>
                      {f.rotulo}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Form.Label>Tipo de pedido *</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Button
                size="sm"
                variant={form.tipo_entrega === "entrega" ? "danger" : "secondary"}
                onClick={() => setForm({ ...form, tipo_entrega: "entrega" })}
              >
                Entrega
              </Button>
              <Button
                size="sm"
                variant={form.tipo_entrega === "retirada" ? "danger" : "secondary"}
                onClick={() => setForm({ ...form, tipo_entrega: "retirada" })}
              >
                Retirada
              </Button>
            </div>

            {form.tipo_entrega === "entrega" && clienteSelecionado && (
              <div
                className="small mb-3"
                style={{
                  color: clienteSelecionado.id_endereco ? undefined : "#e0b020",
                }}
              >
                {clienteSelecionado.id_endereco
                  ? `Endereço de entrega: ${textoEndereco}`
                  : "Este cliente não tem endereço cadastrado."}
              </div>
            )}

            <h5 className="mt-3">Itens do pedido</h5>
            {carrinho.length === 0 && (
              <div className="small mb-3">Nenhum produto adicionado.</div>
            )}

            {carrinho.map((item) => {
              const erro = erroQuantidade(item);
              const quantidade = lerQuantidade(item.quantidade);
              const subtotalValido = Number.isInteger(quantidade) && quantidade > 0;

              return (
                <div key={item.id_produto} className="mb-3">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="flex-grow-1">
                      <div className="fw-bold">{item.nome}</div>
                      <div className="small">
                        {item.unidade} · {formatarPreco(item.preco)} · Estoque{" "}
                        {item.estoque}
                      </div>
                    </div>
                    <Form.Control
                      style={{ width: 90 }}
                      inputMode="numeric"
                      value={item.quantidade}
                      isInvalid={item.tocado && !!erro}
                      onChange={(e) =>
                        alterarQuantidade(item.id_produto, e.target.value)
                      }
                      onBlur={() => marcarTocado(item.id_produto)}
                    />
                    <div style={{ minWidth: 90 }} className="text-end">
                      {subtotalValido ? formatarPreco(item.preco * quantidade) : "—"}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => remover(item.id_produto)}
                    >
                      Remover
                    </Button>
                  </div>
                  {item.tocado && erro && (
                    <div className="text-danger small mt-1">{erro}</div>
                  )}
                </div>
              );
            })}

            <div className="d-flex justify-content-between align-items-center my-3">
              <span className="fs-5 fw-bold">Total do pedido</span>
              <span className="fs-4 fw-bold" style={{ color: "#d32525" }}>
                {formatarPreco(total)}
              </span>
            </div>

            {aviso && (
              <div
                className={`mb-3 ${
                  aviso.tipo === "sucesso" ? "text-success" : "text-danger"
                }`}
              >
                <div className="fw-bold">{aviso.titulo}</div>
                {aviso.itens.map((texto, indice) => (
                  <div key={indice}>{texto}</div>
                ))}
              </div>
            )}

            <Button
              variant="danger"
              className="w-100"
              onClick={registrar}
              disabled={enviando}
            >
              {enviando ? "Registrando..." : "Registrar pedido"}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}