import { prisma } from '../prisma/client';

export const PedidosRepository = {
    findAll() {
        return prisma.pedidos.findMany({ include: { usuario: true, itens: true } });
    },

    findById(id: number) {
        return prisma.pedidos.findUnique({ where: { id }, include: { usuario: true, itens: true } });
    },

    create(data: any) {
        return prisma.pedidos.create({ data });
    },

    async createWithItems(usuario_id: number, items: Array<any>) {

        const total = items.reduce((acc, it) => acc + Number(it.preco) * Number(it.quantidade), 0);

        return prisma.$transaction(async (tx) => {
            const pedido = await tx.pedidos.create({ data: { usuario_id, total } });
            const itensCriados = [] as any[];
            for (const it of items) {
                const criado = await tx.itens_pedido.create({
                    data: {
                        pedido_id: pedido.id,
                        produto_id: it.produto_id,
                        quantidade: it.quantidade,
                        preco: it.preco
                    }
                });
                itensCriados.push(criado);
            }
            const pedidoFull = await tx.pedidos.findUnique({ where: { id: pedido.id }, include: { usuario: true, itens: true } });
            return pedidoFull;
        });
    },

    update(id: number, data: any) {
        return prisma.pedidos.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.pedidos.delete({ where: { id } });
    }
};
