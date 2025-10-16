import { Request, Response } from 'express';
import { ProdutosService } from '../services/produtos.service';

export class ProdutosController {
    private service = new ProdutosService();

    async listar(_req: Request, res: Response) {
        const produtos = await this.service.listarTodos();
        return res.json(produtos);
    }

    async obter(req: Request, res: Response) {
        const id = Number(req.params.id);
        const produto = await this.service.obterPorId(id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        return res.json(produto);
    }

    async criar(req: Request, res: Response) {
        const data = req.body;
        const created = await this.service.criar(data);
        return res.status(201).json(created);
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
