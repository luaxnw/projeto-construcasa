import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../../styles/paginas.css";

const API = "http://localhost:3001";
const INTERVALO_ATUALIZACAO_MS = 30000;

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Cartao({ rotulo, valor }) {
  return (
    <div className="pg-stat">
      <div className="pg-stat-rotulo">{rotulo}</div>
      <div className="pg-stat-valor">{valor}</div>
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <>
      <h3 className="pg-subtitulo">{titulo}</h3>
      <div className="pg-stats" style={{ flexWrap: "wrap" }}>
        {children}
      </div>
    </>
  );
}

export default function Finaceiro() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/dashboard`);
      if (!resp.ok) {
        const retorno = await resp.json().catch(() => ({}));
        throw new Error(retorno.erro || "Não foi possível carregar o painel.");
      }
      setDados(await resp.json());
      setErro("");
    } catch (e) {
      setErro(
        e instanceof TypeError
          ? "Não foi possível conectar ao servidor. Verifique se ele está ligado."
          : e.message
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  // Atualização dinâmica: a cada 30 s, ao voltar para a aba e pelo botão "Atualizar"
  useEffect(() => {
    carregar();

    const timer = setInterval(() => {
      if (!document.hidden) carregar();
    }, INTERVALO_ATUALIZACAO_MS);

    function aoVoltarParaAba() {
      if (!document.hidden) carregar();
    }
    document.addEventListener("visibilitychange", aoVoltarParaAba);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", aoVoltarParaAba);
    };
  }, [carregar]);

  return (
    <div className="pg">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h2 className="pg-titulo">Painel</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {dados && (
            <span className="pg-item-sub">
              Atualizado às {new Date(dados.atualizadoEm).toLocaleTimeString("pt-BR")}
            </span>
          )}
          <Button
            variant="secondary"
            className="pg-btn pg-btn-sec"
            onClick={carregar}
          >
            Atualizar
          </Button>
        </div>
      </div>

      {erro && <div className="pg-aviso" role="alert">{erro}</div>}
      {carregando && !dados && <div className="pg-vazio">Carregando painel...</div>}

      {dados && (
        <>
          <Secao titulo="Vendas no mês">
            <Cartao rotulo="Total vendido (pedidos pagos)" valor={moeda.format(dados.vendas.totalNoMes)} />
            <Cartao rotulo="Pedidos no mês" valor={dados.pedidos.noMes} />
          </Secao>

          <Secao titulo="Situação dos pedidos">
            <Cartao rotulo="Em aberto" valor={dados.pedidos.emAberto} />
            <Cartao rotulo="Aguardando pagamento" valor={dados.pedidos.aguardandoPagamento} />
            <Cartao rotulo="Finalizados" valor={dados.pedidos.finalizados} />
            <Cartao rotulo="Cancelados" valor={dados.pedidos.cancelados} />
            <Cartao rotulo="Total de pedidos" valor={dados.pedidos.total} />
          </Secao>

          <Secao titulo="Produtos">
            <Cartao rotulo="Cadastrados" valor={dados.produtos.total} />
            <Cartao rotulo="Disponíveis" valor={dados.produtos.disponiveis} />
            <Cartao rotulo="Indisponíveis" valor={dados.produtos.indisponiveis} />
            <Cartao rotulo="Estoque baixo" valor={dados.produtos.estoqueBaixo} />
          </Secao>

          <Secao titulo="Cadastros">
            <Cartao rotulo="Clientes cadastrados" valor={dados.clientes.total} />
            <Cartao rotulo="Novos clientes no mês" valor={dados.clientes.novosNoMes} />
            <Cartao rotulo="Funcionários ativos" valor={dados.funcionarios.ativos} />
            <Cartao rotulo="Categorias" valor={dados.categorias.total} />
            <Cartao rotulo="Categorias ativas" valor={dados.categorias.ativas} />
          </Secao>
        </>
      )}
    </div>
  );
}