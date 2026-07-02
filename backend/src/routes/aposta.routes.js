import apenasAdmin from "../middlewares/admin.middleware.js";
import ApostaController from "../controllers/aposta.controller.js";
import autenticar from "../middlewares/autenticacao.middleware.js";
import { Router } from "express";

const router = Router();
router.use(autenticar);

router.post("/", ApostaController.apostar);

router.get("/", ApostaController.listarMinhas);

router.get("/admin/todas", apenasAdmin, ApostaController.listarTodas);

router.get("/:id", ApostaController.buscarMinha);

export default router;