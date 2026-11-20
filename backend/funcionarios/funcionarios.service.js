const repository = require("./funcionarios.repository");

async function listar() {
    return repository.listar();
}

async function buscarPorId(id) {
    const funcionario = await repository.buscarPorId(id);

    if (!funcionario)
        throw new Error("FUNCIONARIO_NAO_EXISTE");

    return funcionario;
}

async function buscarPorNome(nome) {
    const funcionario = await repository.buscarPorNome(nome);

    if (!funcionario)
        throw new Error("FUNCIONARIO_NAO_EXISTE");

    return funcionario;
}

async function buscarPorCpf(cpf) {
    const funcionario = await repository.buscarPorCpf(cpf);

    if (!funcionario)
        throw new Error("FUNCIONARIO_NAO_EXISTE");

    return funcionario;
}

async function criar(dados) {
    if (await repository.buscarPorNome(dados.nome)) // regra: não deixa cadastrar com nome repetido
        throw new Error("NOME_JA_EXISTE");

    if (await repository.buscarPorCpf(dados.cpf)) // regra: não deixa cadastrar com cpf repetido
        throw new Error("CPF_JA_EXISTE");

    return repository.criar(dados);
}

async function substituir(id, dados) {
    const funcionarioNome = repository.buscarPorNome(dados.nome);

    if (funcionarioNome && funcionarioNome.id !== Number(id))
        throw new Error("NOME_JA_EXISTE")

    const funcionarioCpf = repository.buscarPorCpf(dados.cpf);

    if (funcionarioCpf && funcionarioCpf.id !== Number(id))
        throw new Error("CPF_JA_EXISTE")

    const funcionarioAtualizado = await repository.substituir(id, dados);

    if (!funcionarioAtualizado)
        throw new Error("FUNCIONARIO_NAO_EXISTE");

    return funcionarioAtualizado;
}

async function excluir(id) {
    const funcionarioDeletado = repository.excluir(id);

    if (!funcionarioDeletado)
        throw new Error("FUNCIONARIO_NAO_EXISTE");

    return funcionarioDeletado;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorNome,
    buscarPorCpf,
    criar,
    substituir,
    excluir
};

