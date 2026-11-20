import { Link } from "react-router-dom";
import "./Financeiro.css";

export default function Financeiro() {
  return (
    <div className="fin">
      <section className="fin-card">
        <div className="fin-faixa" aria-hidden="true" />

        <div className="fin-corpo">
          <svg
            className="fin-icone"
            viewBox="0 0 24 24"
            width="56"
            height="56"
            aria-hidden="true"
          >
            <path
              d="M3 18h18M5 18a7 7 0 0 1 14 0M12 6v5M7.5 8.5l2 2.5M16.5 8.5l-2 2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="fin-pilula">Em construção</span>
          <h1 className="fin-titulo">Financeiro</h1>
          <p className="fin-texto">
            Estamos montando esta área. Em breve você vai acompanhar
            recebimentos, contas a pagar e o fluxo de caixa por aqui.
          </p>

          <Link to="/" className="fin-botao">
            Voltar ao início
          </Link>
        </div>

        <div className="fin-faixa" aria-hidden="true" />
      </section>
    </div>
  );
}
