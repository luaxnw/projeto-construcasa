import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Inicio.css";

const API = "http://localhost:3001";
const INTERVALO_MS = 15000;

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function plural(n, singular, pluralTexto) {
  return n === 1 ? singular : pluralTexto;
}

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function Seta() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// O link ocupa o cartão inteiro (ver .pn-seta::after no CSS),
// então o cartão todo é clicável e só há um ponto de foco por cartão.
function Atalho({ para, rotulo }) {
  return (
    <Link to={para} className="pn-seta" aria-label={rotulo}>
      <Seta />
    </Link>
  );
}

export default function Inicio() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      const resp = await fetch(`${API}/dashboard`);
      if (!resp.ok) throw new Error();
      setDados(await resp.json());
      setErro("");
    } catch {
      setErro(
        "Não foi possível atualizar o painel. Verifique se o servidor está ligado."
      );
    }
  }

  useEffect(() => {
    carregar();

    // Atualiza sozinho a cada 15 segundos e quando a aba volta a ficar visível
    const intervalo = setInterval(carregar, INTERVALO_MS);
    const aoVoltar = () => {
      if (document.visibilityState === "visible") carregar();
    };
    document.addEventListener("visibilitychange", aoVoltar);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, []);

  const primeiroNome = usuario?.nome?.split(" ")[0];
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const p = dados?.produtos;
  const emEstoque = p ? Math.max(p.disponiveis - p.estoqueBaixo, 0) : 0;
  const totalProdutos = p?.total || 0;
  const largura = (n) => (totalProdutos ? `${(n / totalProdutos) * 100}%` : "0%");

  const ped = dados?.pedidos;
  const situacoes = ped
    ? [
        { tom: "escuro", rotulo: "Finalizados", valor: ped.finalizados },
        { tom: "tijolo", rotulo: "Em aberto", valor: ped.emAberto },
        { tom: "ambar", rotulo: "Aguardando pagamento", valor: ped.aguardandoPagamento },
        { tom: "vazio", rotulo: "Cancelados", valor: ped.cancelados },
      ]
    : [];

  return (
    <div className="pn">
      <header className="pn-topo">
        <div>
          <h1 className="pn-titulo">
            {saudacao()}
            {primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="pn-data">{hoje}</p>
        </div>
        <div className="pn-atualiza">
          {dados && (
            <span>
              Atualizado às{" "}
              {new Date(dados.atualizadoEm).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button type="button" className="pn-botao" onClick={carregar}>
            Atualizar
          </button>
        </div>
      </header>

      {erro && (
        <div className="pn-aviso" role="alert">
          {erro}
        </div>
      )}
      {!dados && !erro && <p className="pn-vazio">Carregando painel...</p>}

      {dados && (
        <div className="pn-grade">
          <div className="pn-coluna">
            <section className="pn-card pn-vendas" style={{ "--i": 0 }}>
              <span className="pn-pilula">Vendas pagas neste mês</span>
              <span className="pn-numero pn-vendas-valor">
                {formatarPreco(dados.vendas.totalNoMes)}
              </span>
              <span className="pn-nota">
                {ped.noMes} {plural(ped.noMes, "pedido", "pedidos")} no mês, sem
                contar cancelados
              </span>
            </section>

            <section aria-labelledby="pn-t-pedidos">
              <h2 id="pn-t-pedidos">Pedidos</h2>
              <div className="pn-tiles">
                {situacoes.map((s, i) => (
                  <div
                    key={s.rotulo}
                    className={`pn-card pn-tile pn-tom-${s.tom}`}
                    style={{ "--i": i + 1 }}
                  >
                    <span className="pn-tile-rotulo">{s.rotulo}</span>
                    <div className="pn-tile-base">
                      <span className="pn-numero">{s.valor}</span>
                      <Atalho para="/pedidos" rotulo={`Ver pedidos: ${s.rotulo}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pn-card pn-estoque" style={{ "--i": 5 }}>
              <div className="pn-estoque-topo">
                <h2>Estoque</h2>
                <Atalho para="/produtos" rotulo="Ver produtos" />
              </div>
              <div
                className="pn-barra"
                role="img"
                aria-label={`${emEstoque} produtos com estoque normal, ${p.estoqueBaixo} com estoque baixo e ${p.indisponiveis} indisponíveis`}
              >
                <div
                  className="pn-barra-trecho pn-cor-cal"
                  style={{ width: largura(emEstoque), display: emEstoque ? "block" : "none" }}
                />
                <div
                  className="pn-barra-trecho pn-cor-ambar"
                  style={{ width: largura(p.estoqueBaixo), display: p.estoqueBaixo ? "block" : "none" }}
                />
                <div
                  className="pn-barra-trecho pn-cor-tijolo"
                  style={{ width: largura(p.indisponiveis), display: p.indisponiveis ? "block" : "none" }}
                />
              </div>
              <ul className="pn-lista">
                <li>
                  <span className="pn-amostra pn-cor-cal" />
                  Com estoque
                  <span className="pn-qtd">{emEstoque}</span>
                </li>
                <li>
                  <span className="pn-amostra pn-cor-ambar" />
                  Estoque baixo
                  <span className="pn-qtd">{p.estoqueBaixo}</span>
                </li>
                <li>
                  <span className="pn-amostra pn-cor-tijolo" />
                  Indisponíveis
                  <span className="pn-qtd">{p.indisponiveis}</span>
                </li>
              </ul>
              {p.estoqueBaixo > 0 && (
                <p className="pn-alerta-estoque">
                  {p.estoqueBaixo}{" "}
                  {plural(p.estoqueBaixo, "produto está", "produtos estão")} com
                  estoque baixo. Vale repor.
                </p>
              )}
            </section>
          </div>

          <section className="pn-coluna" aria-labelledby="pn-t-cadastros">
            <h2 id="pn-t-cadastros">Cadastros</h2>
            <div className="pn-cadastros">
              <div className="pn-card pn-cadastro" style={{ "--i": 6 }}>
                <span className="pn-bolha pn-numero">{dados.clientes.total}</span>
                <div className="pn-cadastro-texto">
                  <div className="pn-cadastro-nome">
                    {plural(dados.clientes.total, "Cliente", "Clientes")}
                  </div>
                  <div className="pn-nota">
                    {dados.clientes.novosNoMes}{" "}
                    {plural(dados.clientes.novosNoMes, "novo", "novos")} neste mês
                  </div>
                </div>
                <Atalho para="/clientes" rotulo="Ver clientes" />
              </div>

              <div className="pn-card pn-cadastro" style={{ "--i": 7 }}>
                <span className="pn-bolha pn-numero">{dados.categorias.total}</span>
                <div className="pn-cadastro-texto">
                  <div className="pn-cadastro-nome">
                    {plural(dados.categorias.total, "Categoria", "Categorias")}
                  </div>
                  <div className="pn-nota">
                    {dados.categorias.ativas}{" "}
                    {plural(dados.categorias.ativas, "ativa", "ativas")}
                  </div>
                </div>
                <Atalho para="/categorias" rotulo="Ver categorias" />
              </div>

              <div className="pn-card pn-cadastro" style={{ "--i": 8 }}>
                <span className="pn-bolha pn-numero">{dados.funcionarios.ativos}</span>
                <div className="pn-cadastro-texto">
                  <div className="pn-cadastro-nome">
                    {plural(dados.funcionarios.ativos, "Funcionário", "Funcionários")}
                  </div>
                  <div className="pn-nota">
                    {plural(dados.funcionarios.ativos, "ativo", "ativos")} no sistema
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
