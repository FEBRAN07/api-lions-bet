import Aposta from "../models/aposta.model.js";

async function criar(dados) {
    return Aposta.create(dados);
}

async function listarPorUsuario(idUsuario) {
    return Aposta.find({ usuario: idUsuario }).sort({ createdAt: -1 });
}

async function listarPorEvento(idEvento) {
    return Aposta.find({ evento: idEvento });
}

async function listarTodas() {
    return Aposta.find().sort({ createdAt: -1 });
}

async function buscarPorIdDono(idAposta, idUsuario) {
    return Aposta.findOne({ _id: idAposta, usuario: idUsuario });
}

async function salvar(aposta) {
    aposta.save();
}
const ApostaRepository = {
    criar,
    listarPorUsuario,
    listarPorEvento,
    listarTodas,
    buscarPorIdDono,
    salvar,
};

export default ApostaRepository;