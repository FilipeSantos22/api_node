import { Request, Response } from 'express';
import { PedidosService } from '../services/pedidos.service';

export class PedidosController {
    private service = new PedidosService();

    async listar(_req: Request, res: Response) {
        const pedidos = await this.service.listarTodos();
        return res.json(pedidos);
    }

    async obter(req: Request, res: Response) {
        const id = Number(req.params.id);
        const pedido = await this.service.obterPorId(id);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        return res.json(pedido);
    }

    async criar(req: Request, res: Response) {
        const { usuario_id, items } = req.body;
        const pedido = await this.service.criar(usuario_id, items);
        return res.status(201).json(pedido);
    }

    async atualizar(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await this.service.atualizar(id, data);
        return res.json(updated);
    }

        async excluir(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.excluir(id);
        return res.status(204).send();
    }
}
