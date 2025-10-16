import { ItensPedidoRepository } from '../repositories/itens-pedidos.repository';
import { ProdutosRepository } from '../repositories/produtos.repository';

export class ItensPedidosService {
    async listarTodos() {
        return ItensPedidoRepository.findAll();
    }

    async obterPorId(id: number) {
        return ItensPedidoRepository.findById(id);
    }

    async criar(pedido_id: number, produto_id: number, quantidade: number, preco: number) {
        const produto = await ProdutosRepository.findById(produto_id);
        if (!produto) {
            throw { statusCode: 400, message: 'Produto não encontrado' };
        }

        if (produto.estoque < quantidade) {
            throw { statusCode: 400, message: 'Estoque insuficiente' };
        }

        return ItensPedidoRepository.createWithAdjustments(pedido_id, produto_id, quantidade, preco);
    }

    async atualizar(id: number, data: any) {
        return ItensPedidoRepository.update(id, data);
    }

    async excluir(id: number) {
        return ItensPedidoRepository.delete(id);
    }
}
