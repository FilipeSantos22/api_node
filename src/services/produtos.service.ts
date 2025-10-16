import { ProdutosRepository } from '../repositories/produtos.repository';

export class ProdutosService {
    async listarTodos() {
        return ProdutosRepository.findAll();
    }

    async obterPorId(id: number) {
        return ProdutosRepository.findById(id);
    }

    async criar(data: any) {
        return ProdutosRepository.create(data);
    }

    async atualizar(id: number, data: any) {
        return ProdutosRepository.update(id, data);
    }

    async excluir(id: number) {
        return ProdutosRepository.delete(id);
    }
}
