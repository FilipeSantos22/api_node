import { prisma } from '../prisma/client';

type ItemInput = { produto_id: number; quantidade: number };

const includePedido = {
    include: {
        usuario: { select: { id: true, nome: true, email: true } },
        itens: true
    }
} as const;

export const PedidosRepository =  {
    findAll() {
        return prisma.pedidos.findMany(includePedido);
    },

    findById(id: number) {
        const pedido = prisma.pedidos.findUnique({ where: { id }, ...includePedido });
        return pedido;
    },

    async findByIdPedido(id: number) {
        const pedido = await prisma.pedidos.findUnique({ where: { id } });
        return pedido;
    },

    create(data: any) {
        return prisma.pedidos.create({ data });
    },

    async createWithItems(usuario_id: number, items: ItemInput[]) {
        return prisma.$transaction(async (tx) => {
            const pedido = await tx.pedidos.create({ data: { usuario_id, total: 0 } });
            let total = 0;

            for (const item of items) {
                const produto = await tx.produtos.findUnique({ where: { id: item.produto_id } });
                if (!produto) {
                    throw { statusCode: 400, message: `Produto ${item.produto_id} não encontrado` };
                }

                if (produto.estoque < item.quantidade) {
                    throw { statusCode: 400, message: `Estoque insuficiente para produto ${item.produto_id}` };
                }

                const precoUnit = Number(produto.preco);

                await tx.itens_pedido.create({
                    data: {
                        pedido_id: pedido.id,
                        produto_id: item.produto_id,
                        quantidade: item.quantidade,
                        preco: precoUnit
                    }
                });

                await tx.produtos.update({ where: { id: item.produto_id }, data: { estoque: produto.estoque - item.quantidade } });
                total += precoUnit * Number(item.quantidade);
            }
            await tx.pedidos.update({ where: { id: pedido.id }, data: { total } });

            const pedidoFull = await tx.pedidos.findUnique({ where: { id: pedido.id }, ...includePedido });
            return pedidoFull;
        });
    },

    update(id: number, data: any) {
        return prisma.pedidos.update({ where: { id }, data });
    },

    async deleteWithRestock(id: number) {
        return prisma.$transaction(async (tx) => {
            const itens = await tx.itens_pedido.findMany({ where: { pedido_id: id } });

            for (const item of itens) {
                const produto = await tx.produtos.findUnique({ where: { id: item.produto_id } });
                if (!produto) continue;

                await tx.produtos.update({ where: { id: produto.id }, data: { estoque: produto.estoque + item.quantidade } });
            }

            return tx.pedidos.delete({ where: { id } });
        });
    },

    delete(id: number) {
        return prisma.pedidos.delete({ where: { id } });
    }
};
