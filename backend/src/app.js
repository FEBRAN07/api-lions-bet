import express from "express";

import authRoutes from "./routes/auth.routes.js";

import usuarioRoutes from "./routes/usuario.routes.js";

import eventoRoutes from "./routes/evento.routes.js";

import apostaRoutes from "./routes/aposta.routes.js";

import erroMiddleware from "./middlewares/erro.middleware.js";

import criarErro from "./utils/criarErro.js";

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://api-lions-bet-frontend.onrender.com',
    ...(process.env.CORS_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    return next();
});

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Boilerplate API MVC está rodando." });
});

app.use(authRoutes);

app.use("/api/usuarios", usuarioRoutes);

app.use("/api/eventos", eventoRoutes);

app.use("/api/apostas", apostaRoutes);

app.use((req, res, next) => {
    return next(criarErro("Rota não encontrada.", 404));
});

app.use(erroMiddleware);

export default app;
