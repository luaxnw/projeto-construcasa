const btnCadastroCliente = document.querySelector("#btnCadastroCliente");
const modalCliente = document.querySelector("#modalCliente");
const fecharModal = document.querySelector("#fecharModal");
const formCliente = document.querySelector("#formCliente");
const mensagem = document.querySelector("#mensagem");

btnCadastroCliente.addEventListener("click", () => {
    modalCliente.style.display = "block";
});

fecharModal.addEventListener("click", () => {
    modalCliente.style.display = "none";
});

formCliente.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cliente = {
        id: parseInt(document.querySelector("#idCliente").value),
        nome: document.querySelector("#nomeCliente").value,
        contato: document.querySelector("#contatoCliente").value,
        valor_contrato: parseFloat(document.querySelector("#valorContrato")).value
    };

    const resposta = await fetch("/api/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

});

