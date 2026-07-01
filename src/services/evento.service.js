import EventoRepository from "../repositories/evento.repository.js";
import UsuarioRepository from "../repositories/usuario.repository.js";
import ApostaRepository from "../repositories/aposta.repository.js";
import criarErro from "../utils/criarErro.js";

function validarEvento(evento) {
    if (!evento) {
        throw criarErro("Evento nao encontrado", 404);
    }
    if (evento.status !== "aberto") {
        throw criarErro("Evento ja encerrado", 400);
    }
}

async function criar(idAdmin, dados) {
    return await EventoRepository.criar({ ...dados, criadoPor: idAdmin });
}

async function listarAbertos() {
    return await EventoRepository.listarAbertos();
}

async function listarTodos() {
    return await EventoRepository.listarTodos();
}

async function buscarPorId(idEvento) {
    const evento = EventoRepository.buscarPorId(idEvento);
    validarEvento(evento);
    return evento;
}

async function atualizarOdds(idEvento, dados) {
    const evento = EventoRepository.buscarPorId(idEvento);
    validarEvento(evento);
    evento.oddMandante = dados.oddMandante;
    evento.oddVisitante = dados.oddVisitante;
    evento.oddEmpate = dados.oddEmpate;
    EventoRepository.salvar(evento);
    return { message: "Odds atualizadas" };
}

async function encerrar(idEvento, resultado) {
    const evento = await EventoRepository.buscarPorId(idEvento);
    validarEvento(evento);
    const apostas = await ApostaRepository.listarPorEvento(idEvento);
    let totalApostas = 0;
    let ganhadoras = 0;
    let perdedoras = 0;
    let totalPago = 0;
    apostas.forEach((aposta) => {
        if (aposta.status === "pendente") {
            totalApostas += aposta.valor;
            if (aposta.palpite === resultado) {
                ganhadoras++;
                totalPago += aposta.valor;
                aposta.status = "ganha";
                UsuarioRepository.ajustarSaldo(aposta.usuario, aposta.retornoPotencial);
            } else {
                perdedoras++;
                aposta.status = "perdida";
            }
            ApostaRepository.salvar(aposta);
        }
    });
    evento.status = "encerrado";
    evento.resultado = resultado;
    EventoRepository.salvar(evento);
    return {
        totalApostas,
        ganhadoras,
        perdedoras,
        totalPago,
    };
}

const EventoService = {
    criar,
    listarAbertos,
    listarTodos,
    buscarPorId,
    atualizarOdds,
    encerrar,
};
export default EventoService;
