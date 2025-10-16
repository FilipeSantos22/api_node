import { prisma } from '../prisma/client';

export const ProdutosRepository = {
    findAll() {
        return prisma.produtos.findMany();
    },

    findById(id: number) {
        return prisma.produtos.findUnique({ where: { id } });
    },

    create(data: any) {
        return prisma.produtos.create({ data });
    },

    update(id: number, data: any) {
        return prisma.produtos.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.produtos.delete({ where: { id } });
    }
};
