import { useEffect, useState } from "react";
import { Badge, Button, Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3001";

const ROTULOS_ORDEM = {
    data: "Data",
    valor: "Valor",
    cliente: "Cliente",
};

const STATUS_PEDIDO = {
    em_aberto: { rotulo: "Em aberto", cor: "danger" },
    finalizado: { rotulo: "Finalizado", cor: "success" },
    cancelado: { rotulo: "Cancelado", cor: "secondary" },
};

const STATUS_PAGAMENTO = {
    aguardando_pagamento: { rotulo: "Aguardando pagamento", cor: "warning" },
    pago: { rotulo: "Pago", cor: "success" },
};

const STATUS_ENTREGA = {
    nao_se_aplica: "Retirada",
    pendente: "Entrega pendente",
    em_rota: "Em rota",
    entregue: "Entregue",
};

const FORMAS_PAGAMENTO = {
    pix: "PIX",
    dinheiro: "Dinheiro",
    cartao_debito: "Cartão de débito",
    cartao_credito: "Cartão de crédito",
};

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarData(texto) {
    return new Date(texto).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

// O canal é gravado nas observações como "Canal: WhatsApp"
function lerCanal(observacoes) {
    const encontrado = /^Canal: ([^\n]+)/.exec(observacoes || "");
    return encontrado ? encontrado[1] : "";
}

function EtiquetaStatus({ tabela, valor }) {
    const info = tabela[valor];
    if (!info) return null;

    return (
        <Badge bg={info.cor} text={info.cor === "warning" ? "dark" : undefined}>
            {info.rotulo}
        </Badge>
    );
}

export default function Pedidos() {
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [busca, setBusca] = useState("");
    const [ordem, setOrdem] = useState("data");
    const [filtroStatus, setFiltroStatus] = useState("");
    const [filtroPagamento, setFiltroPagamento] = useState("");
    const [aberto, setAberto] = useState(null);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState(null);

    async function carregar() {
        try {
            const resp = await fetch(`${API}/pedidos`);
            if (!resp.ok) throw new Error();
            setPedidos(await resp.json());
            setErro("");
        } catch {
            setErro(
                "Não foi possível carregar os pedidos. Verifique se o servidor está ligado."
            );
        }
    }

    async function executar(url, corpo, textoSucesso) {
        let resp;
        try {
            resp = await fetch(`${API}${url}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: corpo ? JSON.stringify(corpo) : undefined,
            });
        } catch {
            setAviso({
                tipo: "erro",
                texto: "Não foi possível conectar ao servidor. Verifique se ele está ligado.",
            });
            return;
        }

        const retorno = await resp.json().catch(() => ({}));

        if (!resp.ok) {
            setAviso({
                tipo: "erro",
                texto: retorno.erro || "Não foi possível concluir a ação.",
            });
        } else {
            setAviso({ tipo: "sucesso", texto: textoSucesso });
        }

        carregar(); // atualiza a lista mesmo em caso de erro, pro status ficar correto
    }

    function confirmarPagamento(pedido) {
        executar(
            `/pedidos/${pedido.id_pedido}/pagamento`,
            { status_pagamento: "pago" },
            `Pagamento do pedido #${pedido.id_pedido} confirmado.`
        );
    }

    function voltarParaAguardando(pedido) {
        executar(
            `/pedidos/${pedido.id_pedido}/pagamento`,
            { status_pagamento: "aguardando_pagamento" },
            `Pedido #${pedido.id_pedido} voltou para aguardando pagamento.`
        );
    }

    function cancelarPedido(pedido) {
        if (
            !window.confirm(
                `Cancelar o pedido #${pedido.id_pedido}? Os produtos voltam para o estoque.`
            )
        )
            return;

        executar(
            `/pedidos/${pedido.id_pedido}/cancelar`,
            null,
            `Pedido #${pedido.id_pedido} cancelado e estoque devolvido.`
        );
    }

    useEffect(() => {
        carregar();
    }, []);

    const termo = busca.toLowerCase();

    const filtrados = pedidos.filter((p) => {
        const bateBusca = [p.clientes?.nome, p.clientes?.telefone, String(p.id_pedido)].some(
            (campo) => String(campo || "").toLowerCase().includes(termo)
        );
        const bateStatus = !filtroStatus || p.status_pedido === filtroStatus;
        const batePagamento =
            !filtroPagamento || p.status_pagamento === filtroPagamento;

        return bateBusca && bateStatus && batePagamento;
    });

    const ordenados = [...filtrados].sort((a, b) => {
        if (ordem === "valor") return Number(b.valor_total) - Number(a.valor_total);
        if (ordem === "cliente")
            return String(a.clientes?.nome || "").localeCompare(
                String(b.clientes?.nome || ""),
                "pt-BR"
            );
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const emAberto = pedidos.filter((p) => p.status_pedido === "em_aberto").length;
    const aguardando = pedidos.filter(
        (p) =>
            p.status_pagamento === "aguardando_pagamento" &&
            p.status_pedido !== "cancelado"
    ).length;

    const textoFiltros = [
        ROTULOS_ORDEM[ordem],
        filtroStatus && STATUS_PEDIDO[filtroStatus].rotulo,
        filtroPagamento && STATUS_PAGAMENTO[filtroPagamento].rotulo,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div>
            <h2>Pedidos</h2>

            <div className="d-flex flex-wrap gap-3 my-3">
                <div className="card-cc p-3 text-center">
                    <div className="small">Pedidos registrados:</div>
                    <div className="fs-3 fw-bold">{pedidos.length}</div>
                </div>
                <div className="card-cc p-3 text-center">
                    <div className="small">Pedidos em aberto:</div>
                    <div className="fs-3 fw-bold" style={{ color: "#d32525" }}>
                        {emAberto}
                    </div>
                </div>
                <div className="card-cc p-3 text-center">
                    <div className="small">Aguardando pagamento:</div>
                    <div className="fs-3 fw-bold" style={{ color: "#e0b020" }}>
                        {aguardando}
                    </div>
                </div>
            </div>

            <h4>Histórico de pedidos:</h4>
            <div className="d-flex flex-wrap gap-2 mb-3">
                <Dropdown autoClose="outside">
                    <Dropdown.Toggle variant="secondary" size="sm">
                        Filtros: {textoFiltros}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ maxHeight: 360, overflowY: "auto" }}>
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

                        <Dropdown.Header>Status do pedido</Dropdown.Header>
                        <Dropdown.Item
                            active={filtroStatus === ""}
                            onClick={() => setFiltroStatus("")}
                        >
                            Todos
                        </Dropdown.Item>
                        {Object.entries(STATUS_PEDIDO).map(([chave, info]) => (
                            <Dropdown.Item
                                key={chave}
                                active={filtroStatus === chave}
                                onClick={() => setFiltroStatus(chave)}
                            >
                                {info.rotulo}
                            </Dropdown.Item>
                        ))}

                        <Dropdown.Divider />

                        <Dropdown.Header>Pagamento</Dropdown.Header>
                        <Dropdown.Item
                            active={filtroPagamento === ""}
                            onClick={() => setFiltroPagamento("")}
                        >
                            Todos
                        </Dropdown.Item>
                        {Object.entries(STATUS_PAGAMENTO).map(([chave, info]) => (
                            <Dropdown.Item
                                key={chave}
                                active={filtroPagamento === chave}
                                onClick={() => setFiltroPagamento(chave)}
                            >
                                {info.rotulo}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <Form.Control
                    style={{ flex: "1 1 200px" }}
                    placeholder="Buscar cliente, telefone ou nº do pedido"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                <Button variant="danger" onClick={() => navigate("/pedidos/novo")}>
                    +
                </Button>
            </div>

            {aviso && (
                <div
                    className={`mb-2 ${aviso.tipo === "sucesso" ? "text-success" : "text-danger"
                        }`}
                >
                    {aviso.texto}
                </div>
            )}
            {erro && <div className="text-danger mb-2">{erro}</div>}
            {!erro && filtrados.length === 0 && <div>Nenhum pedido encontrado.</div>}

            {ordenados.map((p) => {
                const canal = lerCanal(p.observacoes);
                const expandido = aberto === p.id_pedido;

                return (
                    <div key={p.id_pedido} className="card-cc p-3 mb-2">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                            <div>
                                <div className="fs-5 fw-bold">
                                    Pedido #{p.id_pedido} · {p.clientes?.nome || "Cliente removido"}
                                </div>
                                <div className="small">
                                    {formatarData(p.createdAt)}
                                    {canal && ` · ${canal}`}
                                    {` · ${FORMAS_PAGAMENTO[p.forma_pagamento] || p.forma_pagamento}`}
                                    {` · ${STATUS_ENTREGA[p.status_entrega] || p.status_entrega}`}
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    <EtiquetaStatus tabela={STATUS_PEDIDO} valor={p.status_pedido} />
                                    <EtiquetaStatus
                                        tabela={STATUS_PAGAMENTO}
                                        valor={p.status_pagamento}
                                    />
                                </div>
                            </div>

                            <div className="text-end">
                                <div className="fs-5 fw-bold" style={{ color: "#d32525" }}>
                                    {formatarPreco(p.valor_total)}
                                </div>
                                <Button
                                    variant="link"
                                    className="text-white p-0"
                                    onClick={() => setAberto(expandido ? null : p.id_pedido)}
                                >
                                    {expandido ? "Ocultar itens" : "Ver itens"}
                                </Button>
                            </div>
                        </div>
                        {p.status_pedido === "em_aberto" && (
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {p.status_pagamento === "aguardando_pagamento" ? (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => confirmarPagamento(p)}
                                    >
                                        Confirmar pagamento
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => voltarParaAguardando(p)}
                                    >
                                        Voltar para aguardando pagamento
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="warning"
                                    onClick={() => cancelarPedido(p)}
                                >
                                    Cancelar pedido
                                </Button>
                            </div>
                        )}
                        {expandido && (
                            <div className="mt-3">
                                {(p.itens || []).map((item) => (
                                    <div
                                        key={item.id_item_pedido}
                                        className="d-flex flex-wrap justify-content-between gap-2 small border-top pt-2 mt-2"
                                    >
                                        <span>
                                            {item.produtos?.nome} · {Number(item.quantidade)}{" "}
                                            {item.unidades_medida?.sigla} ×{" "}
                                            {formatarPreco(item.preco_unitario)}
                                        </span>
                                        <span>{formatarPreco(item.subtotal)}</span>
                                    </div>
                                ))}
                                <div className="small mt-2">
                                    Atendido por {p.funcionarios?.nome}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}