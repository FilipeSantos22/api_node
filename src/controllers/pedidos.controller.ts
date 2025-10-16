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

        const requesterId = Number((req as any).user?.sub);
        if (requesterId && pedido.usuario_id !== requesterId) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        
        return res.json(pedido);
    }

    async criar(req: Request, res: Response) {
        const { usuario_id, items } = req.body;
        const requesterId = Number((req as any).user?.sub);

        if (requesterId && requesterId !== usuario_id) {
            return res.status(403).json({ message: 'Acesso negado' });
        }

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
        return res.status(200).send({message: 'Pedido excluído com sucesso.'});
    }
}
