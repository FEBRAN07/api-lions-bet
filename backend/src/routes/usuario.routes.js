import { Router } from 'express';

import UsuarioController from '../controllers/usuario.controller.js';

import autenticar from '../middlewares/autenticacao.middleware.js';
import apenasAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.get('/perfil', autenticar, UsuarioController.perfil);

router.patch('/perfil', autenticar, UsuarioController.atualizarPerfil);

router.delete('/perfil', autenticar, UsuarioController.removerMinhaConta);

router.get("/carteira", autenticar, UsuarioController.verCarteira);

router.post("/carteira/deposito", autenticar, UsuarioController.depositar);

router.get("/", autenticar, apenasAdmin, UsuarioController.listarTodos);

export default router;
