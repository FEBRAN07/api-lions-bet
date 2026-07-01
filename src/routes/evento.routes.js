import { Router } from "express";
import autenticar from "../middlewares/autenticacao.middleware.js";
import apenasAdmin from "../middlewares/admin.middleware.js";
import EventoController from "../controllers/evento.controller.js";

const router = Router();

router.get("/", EventoController.listarAbertos);

router.get("/:id", EventoController.buscarPorId);

router.post("/", autenticar, apenasAdmin, EventoController.criar);

router.patch("/:id", autenticar, apenasAdmin, EventoController.atualizarOdds);

router.patch("/:id/encerrar", autenticar, apenasAdmin, EventoController.encerrar);

export default router;