import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import "../../styles/paginas.css";

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
        <div className="pg">
            <h2 className="pg-titulo">Produtos</h2>

            <div className="pg-stats">
                <div className="pg-stat">
                    <div className="pg-stat-rotulo">Produtos disponíveis</div>
                    <div className="pg-stat-valor pg-neutro">{disponiveis}</div>
                </div>
                <div className="pg-stat">
                    <div className="pg-stat-rotulo">Produtos indisponíveis</div>
                    <div className="pg-stat-valor">{indisponiveis}</div>
                </div>
                <div className="pg-stat">
                    <div className="pg-stat-rotulo">Estoque baixo</div>
                    <div className="pg-stat-valor pg-alerta">{estoqueBaixo}</div>
                </div>
            </div>

            <h3 className="pg-subtitulo">Lista de produtos</h3>
            <div className="pg-barra">
                <Dropdown autoClose="outside">
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
                    className="pg-busca"
                    placeholder="Buscar por nome ou categoria"
                    aria-label="Buscar produtos"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <Button
                    variant="link"
                    className="pg-novo"
                    aria-label="Novo produto"
                    onClick={abrirNovo}
                >
                    +
                </Button>
            </div>

            {erro && <div className="pg-aviso" role="alert">{erro}</div>}
            {!erro && filtrados.length === 0 && (
                <div className="pg-vazio">Nenhum produto encontrado.</div>
            )}

            <div className="pg-lista">
                {ordenados.map((p) => (
                    <div key={p.id_produto} className="pg-item">
                        <div>
                            <div className="pg-item-nome">{p.nome}</div>
                            <div className="pg-item-sub">
                                {p.categoria?.nome} · {p.unidades_medida?.nome} ·{" "}
                                {formatarPreco(p.preco_venda)} · Estoque {p.qtd_estoque}
                                {!p.ativo && " · Inativo"}
                            </div>
                        </div>

                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="link"
                                className="menu-pontos pg-pontos"
                                aria-label={`Opções de ${p.nome}`}
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
            </div>

            <Modal
                show={modalAberto}
                onHide={() => setModalAberto(false)}
                centered
                className="pg-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        {editandoId ? "Editar produto" : "Cadastrar produto"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="produto-nome">
                        <Form.Label>Nome *</Form.Label>
                        <Form.Control
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="produto-descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="produto-categoria">
                        <Form.Label>Categoria *</Form.Label>
                        <Form.Select
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
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="produto-unidade">
                        <Form.Label>Unidade de medida *</Form.Label>
                        <Form.Select
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
                    </Form.Group>

                    <div className="d-flex gap-3 mb-3">
                        <Form.Group className="flex-fill" controlId="produto-preco">
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
                        </Form.Group>
                        <Form.Group className="flex-fill" controlId="produto-estoque">
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
                        </Form.Group>
                    </div>

                    <Form.Check
                        type="switch"
                        id="produto-ativo"
                        label="Produto ativo"
                        checked={form.ativo}
                        onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
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
