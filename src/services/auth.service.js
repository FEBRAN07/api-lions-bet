import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import UsuarioRepository from "../repositories/usuario.repository.js";

import criarErro from "../utils/criarErro.js";

function validarSenha(senha) {
    if (!senha || senha.length < 6) {
        throw criarErro("A senha deve ter pelo menos 6 caracteres.", 400);
    }
}

function montarUsuarioSeguro(usuario) {
    const usuarioSeguro = usuario.toObject();

    delete usuarioSeguro.senhaHash;

    delete usuarioSeguro.__v;

    return usuarioSeguro;
}

function gerarToken(usuario) {
    if (!process.env.JWT_SECRET) {
        throw criarErro("JWT_SECRET não configurado no ambiente.", 500);
    }

    const dadosDoToken = {
        id: usuario._id.toString(),
        tipo: usuario.tipo,
        email: usuario.email,
    };

    const opcoesDoToken = {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    };

    const token = jwt.sign(dadosDoToken, process.env.JWT_SECRET, opcoesDoToken);

    return token;
}

async function cadastrar({ nome, email, senha }) {
    validarSenha(senha);

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await UsuarioRepository.buscarPorEmail(emailNormalizado);

    if (usuarioExistente) {
        throw criarErro("Email já cadastrado.", 409);
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const usuarioCriado = await UsuarioRepository.criar({
        nome: nome.trim(),
        email: emailNormalizado,
        senhaHash,
    });

    return {
        usuario: montarUsuarioSeguro(usuarioCriado),
        token: gerarToken(usuarioCriado),
    };
}

async function login({ email, senha }) {
    const usuario = await UsuarioRepository.buscarPorEmail(email, true);

    if (!usuario) {
        throw criarErro("Email ou senha incorretos.", 401);
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaCorreta) {
        throw criarErro("Email ou senha incorretos.", 401);
    }

    return {
        usuario: montarUsuarioSeguro(usuario),
        token: gerarToken(usuario),
    };
}

const AuthService = {
    cadastrar,
    login,
};

export default AuthService;
