import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";


const API = "http://localhost:3001";

// Estoque igual ou abaixo disso aparece como "baixo". Ajuste se quiser.
const ESTOQUE_BAIXO = 20;

const ROTULOS_ORDEM = {
    nome: "Nome",
    preco: "Preço",
    estoque: "Estoque",
};

const FORM_VAZIO = {
    nome: "",
    descricao: "",
    id_categoria: "",
    id_unidade_medida: "",
    preco_venda: "",
    qtd_estoque: "0",
    ativo: true,
};

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default function Produtos() {
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
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
            const [respProdutos, respCategorias, respUnidades] = await Promise.all([
                fetch(`${API}/produtos`),
                fetch(`${API}/categorias`),
                fetch(`${API}/unidades`),
            ]);
            if (!respProdutos.ok || !respCategorias.ok || !respUnidades.ok) {
                throw new Error();
            }
            setProdutos(await respProdutos.json());
            setCategorias(await respCategorias.json());
            setUnidades(await respUnidades.json());
            setErro("");
        } catch {
            setErro("Não foi possível carregar os produtos. Verifique se o servidor está ligado.");
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

    function abrirEdicao(produto) {
        setEditandoId(produto.id_produto);
        setForm({
            nome: produto.nome,
            descricao: produto.descricao || "",
            id_categoria: String(produto.id_categoria),
            id_unidade_medida: String(produto.id_unidade_medida),
            preco_venda: String(produto.preco_venda),
            qtd_estoque: String(produto.qtd_estoque),
            ativo: produto.ativo,
        });
        setErroForm("");
        setModalAberto(true);
    }

    function validar() {
        if (!form.nome.trim()) return "O nome é obrigatório.";
        if (!form.id_categoria) return "Escolha uma categoria.";
        if (!form.id_unidade_medida) return "Escolha uma unidade de medida.";
        if (form.preco_venda === "" || Number(form.preco_venda) < 0)
            return "Informe um preço maior ou igual a zero.";
        if (!Number.isInteger(Number(form.qtd_estoque)) || Number(form.qtd_estoque) < 0)
            return "O estoque deve ser um número inteiro maior ou igual a zero.";
        return "";
    }

    async function salvar() {
        const problema = validar();
        if (problema) {
            setErroForm(problema);
            return;
        }

        setSalvando(true);
        setErroForm("");
        try {
            const resp = await fetch(
                editandoId ? `${API}/produtos/${editandoId}` : `${API}/produtos`,
                {
                    method: editandoId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nome: form.nome.trim(),
                        descricao: form.descricao.trim(),
                        id_categoria: Number(form.id_categoria),
                        id_unidade_medida: Number(form.id_unidade_medida),
                        preco_venda: Number(form.preco_venda),
                        qtd_estoque: Number(form.qtd_estoque),
                        ativo: form.ativo,
                    }),
                }
            );
            if (!resp.ok) {
                const retorno = await resp.json().catch(() => ({}));
                throw new Error(retorno.erro || "Não foi possível salvar o produto.");
            }
            setModalAberto(false);
            carregar();
        } catch (e) {
            setErroForm(e.message);
        } finally {
            setSalvando(false);
        }
    }

    async function excluir(produto) {
        if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return;

        try {
            const resp = await fetch(`${API}/produtos/${produto.id_produto}`, {
                method: "DELETE",
            });
            if (!resp.ok) {
                const retorno = await resp.json().catch(() => ({}));
                throw new Error(retorno.erro || "Não foi possível excluir o produto.");
            }
            setProdutos((atuais) =>
                atuais.filter((p) => p.id_produto !== produto.id_produto)
            );
            setErro("");
        } catch (e) {
            setErro(e.message);
        }
    }

    const termo = busca.toLowerCase();
    const filtrados = produtos.filter((p) => {
        const bateBusca = [p.nome, p.categoria?.nome].some((campo) =>
            String(campo || "").toLowerCase().includes(termo)
        );
        const bateCategoria =
            !filtroCategoria || String(p.id_categoria) === filtroCategoria;

        return bateBusca && bateCategoria;
    });

    const nomeCategoriaFiltro = categorias.find(
        (c) => String(c.id_categoria) === filtroCategoria
    )?.nome;

    const ordenados = [...filtrados].sort((a, b) => {
        if (ordem === "preco") return Number(a.preco_venda) - Number(b.preco_venda);
        if (ordem === "estoque") return a.qtd_estoque - b.qtd_estoque;
        return String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });

    const disponiveis = produtos.filter((p) => p.ativo && p.qtd_estoque > 0).length;
    const indisponiveis = produtos.filter((p) => !p.ativo || p.qtd_estoque === 0).length;
    const estoqueBaixo = produtos.filter(
        (p) => p.ativo && p.qtd_estoque > 0 && p.qtd_estoque <= ESTOQUE_BAIXO
    ).length;

    return (
        <div>
            <h2>Produtos</h2>

            <div className="d-flex flex-wrap gap-3 my-3">
                <div className="card-cc p-3 text-center">
                    <div className="small">Produtos disponíveis:</div>
                    <div className="fs-3 fw-bold">{disponiveis}</div>
                </div>
                <div className="card-cc p-3 text-center">
                    <div className="small">Produtos indisponíveis:</div>
                    <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
                        {indisponiveis}
                    </div>
                </div>
                <div className="card-cc p-3 text-center">
                    <div className="small">Estoque baixo:</div>
                    <div className="fs-3 fw-bold" style={{ color: "#e0b020" }}>
                        {estoqueBaixo}
                    </div>
                </div>
            </div>

            <h4>Lista de produtos:</h4>
            <div className="d-flex gap-2 mb-3">
                <Dropdown autoClose="outside">
                    <Dropdown.Toggle variant="secondary" size="sm">
                        Filtros: {ROTULOS_ORDEM[ordem]}
                        {nomeCategoriaFiltro && ` · ${nomeCategoriaFiltro}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: 320, overflowY: "auto" }}>
                        <Dropdown.Header>Ordenar por</Dropdown.Header>
                        {Object.entries(ROTULOS_ORDEM).map(([chave, rotulo]) => (
                            <Dropdown.Item
                                key={chave}
                                active={ordem === chave}
                                onClick={() => setOrdem(chave)}
                            >
                                {rotulo}
                            </Dropdown.Item>
                        ))}

                        <Dropdown.Divider />

                        <Dropdown.Header>Categoria</Dropdown.Header>
                        <Dropdown.Item
                            active={filtroCategoria === ""}
                            onClick={() => setFiltroCategoria("")}
                        >
                            Todas
                        </Dropdown.Item>
                        {categorias.map((c) => (
                            <Dropdown.Item
                                key={c.id_categoria}
                                active={filtroCategoria === String(c.id_categoria)}
                                onClick={() => setFiltroCategoria(String(c.id_categoria))}
                            >
                                {c.nome}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <Form.Control
                    placeholder="Buscar por nome ou categoria"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <Button variant="danger" onClick={abrirNovo}>
                    +
                </Button>
            </div>

            {erro && <div className="text-danger mb-2">{erro}</div>}
            {!erro && filtrados.length === 0 && <div>Nenhum produto encontrado.</div>}

            {ordenados.map((p) => (
                <div
                    key={p.id_produto}
                    className="card-cc p-3 mb-2 d-flex justify-content-between align-items-start"
                >
                    <div>
                        <div className="fs-5 fw-bold">{p.nome}</div>
                        <div className="small">
                            {p.categoria?.nome} · {p.unidades_medida?.nome} ·{" "}
                            {formatarPreco(p.preco_venda)} · Estoque {p.qtd_estoque}
                            {!p.ativo && " · Inativo"}
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
                            <Dropdown.Item onClick={() => abrirEdicao(p)}>Editar</Dropdown.Item>
                            <Dropdown.Item onClick={() => excluir(p)}>Excluir</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            ))}

            <Modal show={modalAberto} onHide={() => setModalAberto(false)} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        {editandoId ? "Editar produto" : "Cadastrar produto"}
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

                    <Form.Label>Categoria *</Form.Label>
                    <Form.Select
                        className="mb-3"
                        value={form.id_categoria}
                        onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                    >
                        <option value="">Selecione...</option>
                        {categorias.map((c) => (
                            <option key={c.id_categoria} value={c.id_categoria}>
                                {c.nome}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Label>Unidade de medida *</Form.Label>
                    <Form.Select
                        className="mb-3"
                        value={form.id_unidade_medida}
                        onChange={(e) =>
                            setForm({ ...form, id_unidade_medida: e.target.value })
                        }
                    >
                        <option value="">Selecione...</option>
                        {unidades.map((u) => (
                            <option key={u.id_unidade_medida} value={u.id_unidade_medida}>
                                {u.nome} ({u.sigla})
                            </option>
                        ))}
                    </Form.Select>

                    <div className="d-flex gap-3 mb-3">
                        <div className="flex-fill">
                            <Form.Label>Preço de venda (R$) *</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.preco_venda}
                                onChange={(e) =>
                                    setForm({ ...form, preco_venda: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex-fill">
                            <Form.Label>Estoque</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="1"
                                value={form.qtd_estoque}
                                onChange={(e) =>
                                    setForm({ ...form, qtd_estoque: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <Form.Check
                        type="switch"
                        label="Produto ativo"
                        checked={form.ativo}
                        onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
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