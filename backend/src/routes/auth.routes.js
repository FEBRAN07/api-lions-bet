import { Router } from 'express';

import AuthController from '../controllers/auth.controller.js';

import validarCampos from '../middlewares/validarCampos.middleware.js';

const router = Router();

router.post('/api/auth/cadastro', validarCampos.validarCadastro, AuthController.cadastrar);

router.post('/api/auth/login', validarCampos.validarLogin, AuthController.login);

export default router;
