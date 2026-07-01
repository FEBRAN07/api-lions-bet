import AuthService from "../services/auth.service.js";

async function cadastrar(req, res, next) {
    try {
        const resultado = await AuthService.cadastrar(req.body);

        return res.status(201).json(resultado);
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const resultado = await AuthService.login(req.body);

        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
}

const AuthController = {
    cadastrar,
    login,
};

export default AuthController;
