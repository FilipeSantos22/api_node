-- Tabela de Usuários
-- ===============================

`CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR(255) NOT NULL,
cep VARCHAR(9),
rua VARCHAR(150),
bairro VARCHAR(100),
cidade VARCHAR(100),
estado VARCHAR(2),
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

-- ===============================
-- 📦 Tabela de Produtos
-- ===============================

`CREATE TABLE produtos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
preco DECIMAL(10,2) NOT NULL,
estoque INT NOT NULL DEFAULT 0,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

-- ===============================
--  Tabela de Pedidos
-- ===============================

`CREATE TABLE pedidos (
id INT AUTO_INCREMENT PRIMARY KEY,
usuario_id INT NOT NULL,
total DECIMAL(12,2) NOT NULL DEFAULT 0,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);`

-- ===============================
-- Tabela de Itens do Pedido
-- ===============================

`CREATE TABLE itens_pedido (
id INT AUTO_INCREMENT PRIMARY KEY,
pedido_id INT NOT NULL,
produto_id INT NOT NULL,
quantidade INT NOT NULL,
preco DECIMAL(10,2) NOT NULL,
FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);`
-- ===============================
-- INSERTS INICIAIS
-- ===============================

-- 1) Inserir usuários
INSERT INTO usuarios (nome, email, senha, cep, rua, bairro, cidade, estado, criado_em)
VALUES
('João Silva','joao@email.com','senha123','01001-000','Rua A','Centro','São Paulo','SP', NOW()),
('Maria Oliveira','maria@email.com','senha456','20010-000','Avenida B','Botafogo','Rio de Janeiro','RJ', NOW());

-- 2) Inserir produtos
INSERT INTO produtos (nome, preco, estoque, criado_em)
VALUES
('Camiseta Polo', 79.90, 10, NOW()),
('Caneca de Cerâmica', 29.50, 25, NOW());

-- 3) Criar pedido para João (assume que João tenha id = 1; ajuste se necessário)
INSERT INTO pedidos (usuario_id, total, criado_em)
VALUES (1, 0, NOW());

-- 4) Inserir itens do pedido 1 (assume produto ids 1 e 2; ajuste se necessário)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco)
VALUES
(1, 1, 2, 79.90),
(1, 2, 1, 29.50);
