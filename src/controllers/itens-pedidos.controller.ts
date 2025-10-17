import { Request, Response } from 'express';
import { ItensPedidosService } from '../services/itens-pedidos.service';

export class ItensPedidosController {
    private service = new ItensPedidosService();

    async listar(_req: Request, res: Response) {
        const pedido_id = _req.params.pedido_id ? Number(_req.params.pedido_id) : undefined;
        if (pedido_id) {
            const itens = await this.service.listarPorPedido(pedido_id);
            return res.json(itens);
        }

        const itens = await this.service.listarTodos();
        return res.json(itens);
    }

    async obter(req: Request, res: Response) {
        const id = Number(req.params.id);
        const item = await this.service.obterPorId(id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }

        return res.json(item);
    }


    async atualizar(req: Request, res: Response) {
        const pedido_id = Number(req.params.pedido_id);
        const data = req.body;
        const updated = await this.service.atualizar(pedido_id, data);
        return res.json(updated);
    }

    async excluir(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.excluir(id);
        return res.status(204).send();
    }
}
