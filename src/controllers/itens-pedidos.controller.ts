import { Request, Response } from 'express';
import { ItensPedidosService } from '../services/itens-pedidos.service';

export class ItensPedidosController {
    private service = new ItensPedidosService();

    async listar(_req: Request, res: Response) {
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

    async criar(req: Request, res: Response) {
        const { pedido_id, produto_id, quantidade, preco } = req.body;
        const item = await this.service.criar(pedido_id, produto_id, quantidade, preco);
        return res.status(201).json(item);
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
