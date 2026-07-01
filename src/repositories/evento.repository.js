import Evento from "../models/evento.model.js";

async function criar(dados) {
    return Evento.create(dados);
}

async function listarAbertos() {
    return Evento.find({ status: "aberto" }).sort({ createdAt: -1 });
}

async function listarTodos() {
    return Evento.find().sort({ createdAt: -1});
}

async function buscarPorId(idEvento) {
    return Evento.findById(idEvento);
}

async function salvar(evento) {
    evento.save()
}

const EventoRepository = {
    criar,
    listarAbertos,
    listarTodos,
    buscarPorId,
    salvar,
};

export default EventoRepository;