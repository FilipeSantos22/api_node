import { Router } from 'express';
import { ItensPedidosController } from '../controllers/itens-pedidos.controller';
import { wrapAsync } from '../utils/wrapAsync';

const router = Router();
const controller = new ItensPedidosController();

router.get('/', wrapAsync((req, res) => controller.listar(req, res)));
router.get('/:id', wrapAsync((req, res) => controller.obter(req, res)));
router.post('/', wrapAsync((req, res) => controller.criar(req, res)));
router.put('/:id', wrapAsync((req, res) => controller.atualizar(req, res)));
router.delete('/:id', wrapAsync((req, res) => controller.excluir(req, res)));

export default router;