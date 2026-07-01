import UsuarioService from "../services/usuario.service.js";

async function perfil(req, res, next) {
    try {
        const usuario = await UsuarioService.buscarPerfil(req.usuario.id);

        return res.status(200).json({ usuario });
    } catch (error) {
        return next(error);
    }
}

async function listar(req, res, next) {
    try {
        const usuarios = await UsuarioService.listarUsuarios();

        return res.status(200).json({ usuarios });
    } catch (error) {
        return next(error);
    }
}

async function atualizarPerfil(req, res, next) {
    try {
        const usuario = await UsuarioService.atualizarPerfil(req.usuario.id, req.body);

        return res.status(200).json({ usuario });
    } catch (error) {
        return next(error);
    }
}

async function removerMinhaConta(req, res, next) {
    try {
        const resultado = await UsuarioService.removerMinhaConta(req.usuario.id);
        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
}

async function verCarteira(req, res, next) {
    try {
        const carteira = await UsuarioService.verCarteira(req.usuario.id);
        return res.status(200).json({ carteira });
    } catch (error) {
        next(error);
    }
}

async function depositar(req, res, next) {
    try {
        const saldo = await UsuarioService.depositar(req.usuario.id, req.body.valor);
        return res.status(201).json({ saldo });
    } catch (error) {
        next(error);
    }
}

async function listarTodos(req, res, next) {
    try {
        const usuarios = await UsuarioService.listarUsuarios();
        return res.status(200).json({ usuarios });
    } catch (error) {
        next(error);
    }
}

const UsuarioController = {
    perfil,
    listar,
    atualizarPerfil,
    removerMinhaConta,
    verCarteira,
    depositar,
    listarTodos,
};

export default UsuarioController;
