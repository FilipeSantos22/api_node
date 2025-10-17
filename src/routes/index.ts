import { Router } from 'express';
import usuariosRouter from './usuarios.router';
import produtosRouter from './produtos.router';
import pedidosRouter from './pedidos.router';
import itensPedidosRouter from './itens-pedidos.router';
import authRouter from './auth.router';

const router = Router();

router.use('/usuarios', usuariosRouter);
router.use('/produtos', produtosRouter);
router.use('/pedidos', pedidosRouter);
router.use('/itens-pedidos/:pedido_id/itens', itensPedidosRouter);
router.use('/auth', authRouter);

export default router;