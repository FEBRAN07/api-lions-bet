import Usuario from "../models/usuario.model.js";

async function criar(dadosDoUsuario) {
    return Usuario.create(dadosDoUsuario);
}

async function buscarPorEmail(email, incluirSenha = false) {
    const query = Usuario.findOne({ email: email.trim().toLowerCase() });

    if (incluirSenha) {
        query.select("+senhaHash");
    }

    return query;
}

async function buscarPorId(id) {
    return Usuario.findById(id);
}

async function listarTodos() {
    return Usuario.find().sort({ createdAt: -1 });
}

async function atualizarPorId(id, dadosAtualizados) {
    return Usuario.findByIdAndUpdate(id, dadosAtualizados, {
        new: true,

        runValidators: true,
    });
}

async function deletarPorId(id) {
    return Usuario.findByIdAndDelete(id);
}

async function ajustarSaldo(idUsuario, valor) {
    return Usuario.findByIdAndUpdate(idUsuario, { $inc: { saldo: valor } }, { new: true, runValidators: true });
}

const UsuarioRepository = {
    criar,
    buscarPorEmail,
    buscarPorId,
    listarTodos,
    atualizarPorId,
    deletarPorId,
    ajustarSaldo,
};

export default UsuarioRepository;
