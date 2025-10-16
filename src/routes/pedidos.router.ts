import { Router } from 'express';
import { PedidosController } from '../controllers/pedidos.controller';
import { wrapAsync } from '../utils/wrapAsync';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const controller = new PedidosController();

router.get('/', authenticate, wrapAsync((req, res) => controller.listar(req, res)));
router.get('/:id', authenticate, wrapAsync((req, res) => controller.obter(req, res)));
router.post('/', authenticate, wrapAsync((req, res) => controller.criar(req, res)));
router.put('/:id', authenticate, wrapAsync((req, res) => controller.atualizar(req, res)));
router.delete('/:id', authenticate, wrapAsync((req, res) => controller.excluir(req, res)));


export default router;