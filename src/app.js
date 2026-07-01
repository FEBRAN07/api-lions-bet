import express from "express";

import authRoutes from "./routes/auth.routes.js";

import usuarioRoutes from "./routes/usuario.routes.js";

import eventoRoutes from "./routes/evento.routes.js";

import apostaRoutes from "./routes/aposta.routes.js";

import erroMiddleware from "./middlewares/erro.middleware.js";

import criarErro from "./utils/criarErro.js";

const app = express();

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
