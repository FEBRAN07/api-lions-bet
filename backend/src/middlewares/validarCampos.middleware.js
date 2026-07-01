import criarErro from '../utils/criarErro.js';

function validarCadastro(req, res, next) {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return next(criarErro("O campo 'nome' é obrigatório.", 400));
    }

    if (!email) {
        return next(criarErro("O campo 'email' é obrigatório.", 400));
    }

    if (!senha) {
        return next(criarErro("O campo 'senha' é obrigatório.", 400));
    }

    return next();
}

function validarLogin(req, res, next) {
    const { email, senha } = req.body;

    if (!email) {
        return next(criarErro("O campo 'email' é obrigatório.", 400));
    }

    if (!senha) {
        return next(criarErro("O campo 'senha' é obrigatório.", 400));
    }

    return next();
}

const validarCampos = {
    validarCadastro,
    validarLogin,
};

export default validarCampos;
