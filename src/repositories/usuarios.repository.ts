import { prisma } from '../prisma/client';

export const UsuariosRepository = {
    findAll() {
        return prisma.usuarios.findMany();
    },

    findById(id: number) {
        return prisma.usuarios.findUnique({ where: { id } });
    },

    create(data: any) {
        return prisma.usuarios.create({ data });
    },

    update(id: number, data: any) {
        return prisma.usuarios.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.usuarios.delete({ where: { id } });
    }
};
