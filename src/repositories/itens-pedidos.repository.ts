import { prisma } from '../prisma/client';

export const ItensPedidoRepository = {
    findAll() {
        return prisma.itens_pedido.findMany({ include: { produto: true, pedido: true } });
    },

    findById(id: number) {
        return prisma.itens_pedido.findUnique({ where: { id }, include: { produto: true, pedido: true } });
    },

    findByPedido(pedido_id: number) {
        return prisma.itens_pedido.findMany({ where: { pedido_id } });
    },

    create(data: any) {
        return prisma.itens_pedido.create({ data });
    },

    // Create item and adjust pedido total and product estoque in a single transaction
    // async createWithAdjustments(pedido_id: number, produto_id: number, quantidade: number, preco: number) {
    //     return prisma.$transaction(async (tx) => {
    //         const item = await tx.itens_pedido.create({ data: { pedido_id, produto_id, quantidade, preco } });

    //                 // recalcula total do pedido
    //                 // soma total real: calcular com query de items
    //         const items = await tx.itens_pedido.findMany({ where: { pedido_id } });
    //         const total = items.reduce((acc, it) => acc + Number(it.preco) * Number(it.quantidade), 0);

    //         await tx.pedidos.update({ where: { id: pedido_id }, data: { total } });

    //         // decrementar estoque do produto
    //         const produto = await tx.produtos.findUnique({ where: { id: produto_id } });
    //         if (produto) {
    //             await tx.produtos.update({ where: { id: produto_id }, data: { estoque: produto.estoque - quantidade } });
    //         }

    //         const itemFull = await tx.itens_pedido.findUnique({ where: { id: item.id }, include: { produto: true, pedido: true } });
    //         return itemFull;
    //     });
    // },

    update(id: number, data: any) {
        return prisma.itens_pedido.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.itens_pedido.delete({ where: { id } });
    }
};
