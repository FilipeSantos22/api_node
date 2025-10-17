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

    update(id: number, data: any) {
        return prisma.itens_pedido.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.itens_pedido.delete({ where: { id } });
    }
};
