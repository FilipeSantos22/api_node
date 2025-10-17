import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';
import { wrapAsync } from '../utils/wrapAsync';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const controller = new UsuariosController();

router.get('/', authenticate, wrapAsync((req, res) => controller.listar(req, res)));
router.get('/:id', authenticate, wrapAsync((req, res) => controller.obter(req, res)));
router.put('/:id', authenticate, wrapAsync((req, res) => controller.atualizar(req, res)));
router.delete('/:id', authenticate, wrapAsync((req, res) => controller.excluir(req, res)));

export default router;