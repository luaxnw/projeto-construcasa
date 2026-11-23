const services = require("./dashboard.service");

async function resumo(req, res) {
    try {
        const dados = await services.resumo();
        return res.status(200).json(dados);
    } catch (erro) {
        console.log("Erro ao montar o dashboard:", erro);
        return res.status(500).json({ erro: "Não foi possível carregar o painel." });
    }
}

module.exports = { resumo };