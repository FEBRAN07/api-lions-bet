import jwt from "jsonwebtoken";

import criarErro from "../utils/criarErro.js";

function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(criarErro("Token não informado.", 401));
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
        return next(criarErro("Formato do token inválido. Use: Bearer TOKEN.", 401));
    }

    try {
        const dadosDoToken = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = {
            id: dadosDoToken.id,
            tipo: dadosDoToken.tipo,
            email: dadosDoToken.email,
        };

        return next();
    } catch (error) {
        return next(criarErro("Token inválido ou expirado.", 401));
    }
}

export default autenticar;
