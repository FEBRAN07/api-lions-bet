import ApostaRepository from "../repositories/aposta.repository.js";
import UsuarioRepository from "../repositories/usuario.repository.js";
import criarErro from "../utils/criarErro.js";
import EventoRepository from "../repositories/evento.repository.js";

async function apostar(idUsuario, dados) {
    const { palpite, valor } = dados;
    const idEvento = dados.evento;
    const evento = await EventoRepository.buscarPorId(idEvento);
    if (!evento) {
        throw criarErro("Evento nao encontrado", 404);
    }
    if (evento.status !== "aberto") {
        throw criarErro("As apostas para este evento estao encerradas.", 400);
    }
    if (!(palpite === "mandante" || palpite === "empate" || palpite === "visitante")) {
        throw criarErro("Palpite invalido.", 400);
    }
    if (!valor || valor <= 0) {
        throw criarErro("O valor da aposta deve ser maior que zero.", 400);
    }
    const usuario = await UsuarioRepository.buscarPorId(idUsuario);
    if (!usuario) {
        throw criarErro("Usuario nao encontrado.", 404);
    }
    if (usuario.saldo < valor) {
        throw criarErro("Saldo insuficiente", 400);
    }
    let oddNaAposta = 0;
    switch (palpite) {
        case "mandante":
            oddNaAposta = evento.oddMandante;
        case "empate":
            oddNaAposta = evento.oddEmpate;
        case "visitante":
            oddNaAposta = evento.oddVisitante;
    }
    const retornoPotencial = (valor * oddNaAposta).toFixed(2);
    UsuarioRepository.ajustarSaldo(idUsuario, -valor);
    const aposta = {
        usuario: idUsuario,
        evento: evento,
        palpite: palpite,
        valor: valor,
        oddNaAposta: oddNaAposta,
        retornoPotencial: retornoPotencial,
    };
    return await ApostaRepository.criar(aposta);
}

async function listarMinhas(idUsuario) {
    return await ApostaRepository.listarPorUsuario(idUsuario);
}

async function buscarMinha(idUsuario, idAposta) {
    const apostas = await ApostaRepository.buscarPorIdDono(idAposta, idUsuario);
    if (!apostas) {
        throw criarErro("Apostas nao encontradas", 404);
    }
    return apostas;
}

async function listarTodas() {
    return await ApostaRepository.listarTodas();
}

const ApostaService = {
    apostar,
    listarMinhas,
    buscarMinha,
    listarTodas,
};

export default ApostaService;
