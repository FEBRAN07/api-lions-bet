import criarErro from "../utils/criarErro.js";

function apenasAdmin(req, res, next) {
    if (!req.usuario || req.usuario.tipo !== "admin") {
        return next(criarErro("Acesso restrito a admin", 403));
    }
    return next();
}

export default apenasAdmin;
