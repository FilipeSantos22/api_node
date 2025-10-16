import { Router } from 'express';
import usuariosRouter from './usuarios.router';
import produtosRouter from './produtos.router';
import pedidosRouter from './pedidos.router';
import itensPedidosRouter from './itens-pedidos.router';


const router = Router();

router.use('/usuarios', usuariosRouter);
router.use('/produtos', produtosRouter);
router.use('/pedidos', pedidosRouter);
router.use('/itens-pedidos', itensPedidosRouter);

export default router;