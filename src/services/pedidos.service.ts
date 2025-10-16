import { PedidosRepository } from '../repositories/pedidos.repository';
import { ProdutosRepository } from '../repositories/produtos.repository';

export class PedidosService {
    async listarTodos() {
        return PedidosRepository.findAll();
    }

    async obterPorId(id: number) {
        const pedido = await PedidosRepository.findByIdPedido(id);

        if (!pedido) {
            throw { statusCode: 400, message: 'Esse pedido não existe.' };
        }

        return pedido;
    }

    async criar(usuario_id: number, items: Array<any>) {
        if (!items || items.length === 0) {
            throw { statusCode: 400, message: 'Pedido deve ter ao menos 1 item' };
        }

        await this.verificarQuantidade(items);
        await this.verificarEstoque(items);

        return PedidosRepository.createWithItems(usuario_id, items);
    }

    async verificarQuantidade (items: Array<any>) {
        for (const it of items) {
            if (it.quantidade <= 0) {
                throw { statusCode: 400, message: `Quantidade inválida para produto ${it.produto_id}` };
            }
        }
    }

    async verificarEstoque (items: Array<any>) {
        for (const it of items) {
            const produto = await ProdutosRepository.findById(it.produto_id);
            
            if (!produto) {
                throw { statusCode: 400, message: `Produto ${it.produto_id} não encontrado` };
            }

            if (produto.estoque < it.quantidade) {
                throw { statusCode: 400, message: `Estoque insuficiente para produto ${it.produto_id}` };
            }
        }
    }

    async atualizar(id: number, data: any) {
        return PedidosRepository.update(id, data);
    }

    async excluir(id: number) {
        await this.obterPorId(id);
        return PedidosRepository.deleteWithRestock(id);
    }
}
