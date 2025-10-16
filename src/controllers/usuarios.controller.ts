import { Request, Response } from 'express';
import { UsuariosService } from '../services/usuarios.service';

export class UsuariosController {
    private service = new UsuariosService();

    async listar(_req: Request, res: Response) {
        const usuarios = await this.service.listarTodos();
        return res.json(usuarios.map((u: any) => ({ ...u, senha: undefined })));
    }

    async obter(req: Request, res: Response) {
        const id = Number(req.params.id);
        const usuario = await this.service.obterPorId(id);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const { senha, ...rest } = usuario as any;
        return res.json(rest);
    }

    async criar(req: Request, res: Response) {
        const data = req.body;
        const created = await this.service.criar(data);
        const { senha, ...rest } = created as any;
        return res.status(201).json(rest);
    }

    async atualizar(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = req.body;
        const updated = await this.service.atualizar(id, data);
        const { senha, ...rest } = updated as any;
        return res.json(rest);
    }

    async excluir(req: Request, res: Response) {
        const id = Number(req.params.id);
        await this.service.excluir(id);
        return res.status(204).send();
    }
}
