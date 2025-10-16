import { ProdutosRepository } from '../repositories/produtos.repository';

export class ProdutosService {
    async listarTodos() {
        return ProdutosRepository.findAll();
    }

    async obterPorId(id: number) {
        return ProdutosRepository.findById(id);
    }

    async criar(data: any) {
        this.validarEstoque(data.estoque);
        this.validarPreco(data.preco);

        return ProdutosRepository.create(data);
    }

    async atualizar(id: number, data: any) {
        await this.produtoExiste(id);
        if (data.estoque !== undefined) {
            data.estoque = await this.validarEstoque(data.estoque);
        }
        if (data.preco !== undefined) {
            data.preco = await this.validarPreco(data.preco);
        }

        return ProdutosRepository.update(id, data);
    }

    async excluir(id: number) {
        await this.produtoExiste(id);
        return ProdutosRepository.delete(id);
    }

    async validarEstoque(estoque: number | string) {

        if (estoque === null || (typeof estoque === 'string' && estoque.trim().length === 0)) {
            throw { statusCode: 400, message: 'Estoque é obrigatório' };
        }
        const valor = Number(estoque);
        if (isNaN(valor) || valor < 0) {
            throw { statusCode: 400, message: 'Estoque inválido' };
        }
        return valor;
    }

    validarPreco(preco: number | string) {
        if (preco === null) {
            throw { statusCode: 400, message: 'Preço é obrigatório' };
        }

        const valor = Number(preco);
        if (isNaN(valor) || valor < 0) {
            throw { statusCode: 400, message: 'Preço inválido' };
        }
        return valor;
    }

    async produtoExiste(id: number) {
        const produto = await this.obterPorId(id);

        if (!produto) {
            throw { statusCode: 404, message: 'Produto não encontrado' };
        }
        return produto;
    }
}
