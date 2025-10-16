import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const usuario1 = await prisma.usuarios.create({
        data: {
            nome: 'João Silva',
            email: 'joao@email.com',
            senha: 'senha123',
            cep: '01001-000',
            rua: 'Rua A',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
        }
    });

    const usuario2 = await prisma.usuarios.create({
        data: {
            nome: 'Maria Oliveira',
            email: 'maria@email.com',
            senha: 'senha456',
            cep: '20010-000',
            rua: 'Avenida B',
            bairro: 'Botafogo',
            cidade: 'Rio de Janeiro',
            estado: 'RJ'
        }
    });

    const produto1 = await prisma.produtos.create({
        data: {
            nome: 'Camiseta Polo',
            preco: 79.9,
            estoque: 10
        }
    });

    const produto2 = await prisma.produtos.create({
        data: {
            nome: 'Caneca de Cerâmica',
            preco: 29.5,
            estoque: 25
        }
    });

    const pedido1 = await prisma.pedidos.create({
        data: {
            usuario_id: usuario1.id,
            total: 0
        }
    });

    const item1 = await prisma.itens_pedido.create({
        data: {
            pedido_id: pedido1.id,
            produto_id: produto1.id,
            quantidade: 2,
            preco: produto1.preco
        }
    });

    const item2 = await prisma.itens_pedido.create({
        data: {
            pedido_id: pedido1.id,
            produto_id: produto2.id,
            quantidade: 1,
            preco: produto2.preco
        }
    });

    const totalPedido1 = item1.quantidade * Number(item1.preco) + item2.quantidade * Number(item2.preco);
        await prisma.pedidos.update({ where: { id: pedido1.id }, data: { total: totalPedido1 } });

        const pedido2 = await prisma.pedidos.create({
        data: {
            usuario_id: usuario2.id,
            total: 0
        }
    });

    const item3 = await prisma.itens_pedido.create({
        data: {
            pedido_id: pedido2.id,
            produto_id: produto2.id,
            quantidade: 3,
            preco: produto2.preco
        }
    });

    const totalPedido2 = item3.quantidade * Number(item3.preco);
    await prisma.pedidos.update({ where: { id: pedido2.id }, data: { total: totalPedido2 } });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
