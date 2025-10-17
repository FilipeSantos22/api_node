import { ItensPedidoRepository } from '../repositories/itens-pedidos.repository';
import { ProdutosRepository } from '../repositories/produtos.repository';
import { PedidosService } from '../services/pedidos.service';
import { prisma } from '../prisma/client';

export class ItensPedidosService {
    async listarTodos() {
        return ItensPedidoRepository.findAll();
    }

    async listarPorPedido(pedido_id: number) {
        return ItensPedidoRepository.findByPedido(pedido_id);
    }

    async obterPorId(id: number) {
        return ItensPedidoRepository.findById(id);
    }

    async atualizar(pedidoId: number, data: any) {
        const pedidosService = new PedidosService();
        await pedidosService.obterPorId(pedidoId);

        const produtoAntigoId = data.produto_antigo_id;
        const produtoNovoId = data.produto_novo_id;
        const quantidade = data.quantidade;
        const preco = data.preco;
        const acao = data.acao;

        if (produtoAntigoId && acao === 'remover') {
            const itens = await ItensPedidoRepository.findByPedido(pedidoId);
            const item = itens.find((it: any) => it.produto_id === produtoAntigoId);

            if (!item) {
                throw { statusCode: 404, message: 'Item não encontrado no pedido' };
            }

            return prisma.$transaction(async (tx) => {
                await tx.itens_pedido.delete({ where: { id: item.id } });

                const items = await tx.itens_pedido.findMany({ where: { pedido_id: pedidoId } });
                const total = items.reduce((acc, it) => acc + Number(it.preco) * Number(it.quantidade), 0);

                await tx.pedidos.update({ where: { id: pedidoId }, data: { total } });
                return { message: 'Item removido' };
            });
        }

        if (produtoAntigoId && produtoNovoId) {
            const produtoNovo = await ProdutosRepository.findById(produtoNovoId);

            if (!produtoNovo) {
                throw { statusCode: 404, message: 'Produto novo não encontrado' };
            }

            if (quantidade && produtoNovo.estoque < quantidade) {
                throw { statusCode: 400, message: 'Estoque insuficiente para produto novo' };
            }

            const itens = await ItensPedidoRepository.findByPedido(pedidoId);
            const item = itens.find((it: any) => it.produto_id === produtoAntigoId);

            if (!item) {
                throw { statusCode: 404, message: 'Item antigo não encontrado no pedido' };
            }

            return prisma.$transaction(async (tx) => {
                const updated = await tx.itens_pedido.update({ where: { id: item.id }, data: { produto_id: produtoNovoId, quantidade: quantidade ?? item.quantidade, preco: preco ?? item.preco } });
                const items = await tx.itens_pedido.findMany({ where: { pedido_id: pedidoId } });
                const total = items.reduce((acc, it) => acc + Number(it.preco) * Number(it.quantidade), 0);

                await tx.pedidos.update({ where: { id: pedidoId }, data: { total } });

                const produtoAntigo = await tx.produtos.findUnique({ where: { id: produtoAntigoId } });
                
                if (produtoAntigo) {
                    await tx.produtos.update({ where: { id: produtoAntigoId }, data: { estoque: produtoAntigo.estoque + Number(item.quantidade) } });
                }

                if (produtoNovo) {
                    await tx.produtos.update({ where: { id: produtoNovoId }, data: { estoque: produtoNovo.estoque - Number(quantidade ?? item.quantidade) } });
                }

                const itemFull = await tx.itens_pedido.findUnique({ where: { id: updated.id }, include: { produto: true, pedido: true } });
                return itemFull;
            });
        }

        if (produtoNovoId && !produtoAntigoId) {
            const produtoNovo = await ProdutosRepository.findById(produtoNovoId);
            
            if (!produtoNovo) {
                throw { statusCode: 404, message: 'Produto não encontrado' };
            }

            if (!quantidade || quantidade <= 0) {
                throw { statusCode: 400, message: 'Quantidade inválida' };
            }

            if (produtoNovo.estoque < quantidade) {
                throw { statusCode: 400, message: 'Estoque insuficiente' };
            }

            return prisma.$transaction(async (tx) => {
                const precoUsado = preco ?? produtoNovo.preco;
                const item = await tx.itens_pedido.create({ data: { pedido_id: pedidoId, produto_id: produtoNovoId, quantidade, preco: precoUsado } });
                const items = await tx.itens_pedido.findMany({ where: { pedido_id: pedidoId } });
                const total = items.reduce((acc, it) => acc + Number(it.preco) * Number(it.quantidade), 0);
                
                await tx.pedidos.update({ where: { id: pedidoId }, data: { total } });
                await tx.produtos.update({ where: { id: produtoNovoId }, data: { estoque: produtoNovo.estoque - quantidade } });

                const itemFull = await tx.itens_pedido.findUnique({ where: { id: item.id }, include: { produto: true, pedido: true } });
                return itemFull;
            });
        }

        throw { statusCode: 400, message: 'Payload inválido - informe produto_antigo_id e/ou produto_novo_id' };
    }

    async excluir(id: number) {
        return ItensPedidoRepository.delete(id);
    }
}
