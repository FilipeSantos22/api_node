import { Router } from 'express';
import { ItensPedidosController } from '../controllers/itens-pedidos.controller';
import { wrapAsync } from '../utils/wrapAsync';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true });
const controller = new ItensPedidosController();

router.use(authenticate);

router.get('/', wrapAsync((req, res) => controller.listar(req, res)));
router.get('/:id', wrapAsync((req, res) => controller.obter(req, res)));
router.patch('/', wrapAsync((req, res) => controller.atualizar(req, res)));
router.delete('/:id', wrapAsync((req, res) => controller.excluir(req, res)));

export default router;