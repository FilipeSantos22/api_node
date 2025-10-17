# API - Teste Manto Sistemas

Bem-vindo(a) ao repositório da API do Teste Manto Sistemas para vaga de desenvolvedor Back-End. Este README traz instruções claras e passo a passo para instalar, configurar e executar a aplicação localmente, além de mostrar como acessar a documentação interativa (Swagger) e dicas rápidas de desenvolvimento.

## Pré-requisitos

- Node.js 14+ (recomendado: 16 ou superior)
- npm (vem junto com o Node.js)
- Uma instância de banco de dados compatível com a configuração do Prisma (o projeto usa MySQL/ MariaDB por padrão — ver `prisma/schema.prisma`).

> Observação: a aplicação usa Prisma como ORM. Caso deseje usar outro banco, atualize `prisma/schema.prisma` e a variável de ambiente `DATABASE_URL`.

## Instalação

1. Clone o repositório:

```powershell
git clone https://github.com/FilipeSantos22/api_node
cd api_node
```

2. Instale as dependências do projeto:

```powershell
npm install
```

3. Dependências extras para a documentação (se ainda não instaladas):

```powershell
npm install swagger-ui-express swagger-jsdoc
```

4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (não comitei esse arquivo) e defina ao menos a variável do banco de dados e a chave JWT:

```
DATABASE_URL="mysql://USER:PASS@HOST:PORT/DATABASE"
JWT_SECRET="uma_chave_secreta_para_jwt"
PORT=3000
```

Você também pode usar um arquivo `.env.local` ou o método que preferir para injetar variáveis de ambiente.

5. Rodar migrações e seed

Se for necessário criar o esquema no banco de dados local, use o Prisma CLI:

```powershell
npx prisma migrate dev --name init
npx prisma db seed
```

> Nota: verifique `prisma/seed.ts` para o script de seed (se presente).

## Como executar em desenvolvimento

Para iniciar o servidor em modo de desenvolvimento (recarregamento automático):

```powershell
npm run dev
```

Por padrão a aplicação escuta na porta `3000` (ou a porta definida em `PORT`).

## Acessando a documentação Swagger

A API inclui uma interface Swagger UI para explorar endpoints, schemas e exemplos.

1. Certifique-se de que a aplicação está rodando (veja seção anterior).
2. Abra no navegador:

```
http://localhost:3000/docs
```

O arquivo de especificação principal está em `src/docs/swagger.ts`. Você pode editar esse arquivo para adicionar/alterar paths, schemas e exemplos. A UI do Swagger irá refletir as mudanças após reiniciar o servidor (ou se houver hot reload configurado).

## Rotas principais (resumo)

- POST /auth/registro — registrar usuário (aceita CEP para auto-preenchimento de endereço via ViaCEP)
- POST /auth/login — login, retorna token JWT
- GET /usuarios — listar usuários (protegido)
- GET /usuarios/{id} — obter usuário (protegido)
- PUT /usuarios/{id} — atualizar usuário (protegido)
- DELETE /usuarios/{id} — deletar usuário (protegido)
- CRUD /produtos — gerenciar produtos (protegido)
- CRUD /pedidos — criar/listar/deletar pedidos (protegido)
- /pedidos/{pedido_id}/itens — operações em itens do pedido (protegido)

> Para detalhes completos de request/response, visite a UI do Swagger.

## Testando com Postman (guia completo)

Esta seção mostra como configurar o Postman para testar todos os endpoints da API de forma prática, incluindo como salvar o token JWT e reutilizá-lo nas requisições protegidas.

1. Abra o Postman e crie um novo Environment (ex: `API Manto`). Adicione as variáveis abaixo:

	 - `baseUrl` = `http://localhost:3000`
	 - `token` = (deixe em branco por enquanto)

2. Crie uma Collection (ex: `API Manto`) e dentro dela adicione requisições conforme os exemplos abaixo. Use `{{baseUrl}}` como base da URL e, para endpoints protegidos, adicione o header `Authorization: Bearer {{token}}`.

3. Login (salvar token automaticamente)

	 - Método: POST
	 - URL: `{{baseUrl}}/auth/login`
	 - Headers: `Content-Type: application/json`
	 - Body (raw JSON):

```json
{
	"email": "teste@example.com",
	"senha": "senha123"
}
```

```
Na response você pode pegar o TOKEN.
```

4. Registrar usuário

	 - Método: POST
	 - URL: `{{baseUrl}}/auth/registro`
	 - Headers: `Content-Type: application/json`
	 - Body (raw JSON):

```json
{
	"nome": "Teste",
	"email": "teste@example.com",
	"senha": "senha123",
	"cep": "01001000"
}
```

	 - Observação: se enviar `cep`, o backend tenta completar endereço via ViaCEP.

5. Usuários (protegido)

	 - Listar usuários
		 - Método: GET
		 - URL: `{{baseUrl}}/usuarios`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Obter usuário por id
		 - Método: GET
		 - URL: `{{baseUrl}}/usuarios/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Atualizar usuário
		 - Método: PUT
		 - URL: `{{baseUrl}}/usuarios/{{id}}`
		 - Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
		 - Body (exemplo):

```json
{
	"nome": "Nome Atualizado",
	"email": "novo@example.com",
	"cep": "01001000"
}
```

	 - Deletar usuário
		 - Método: DELETE
		 - URL: `{{baseUrl}}/usuarios/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

6. Produtos (protegido)

	 - Listar produtos
		 - Método: GET
		 - URL: `{{baseUrl}}/produtos`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Criar produto
		 - Método: POST
		 - URL: `{{baseUrl}}/produtos`
		 - Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
		 - Body (exemplo):

```json
{
	"nome": "Caneta Azul",
	"preco": 3.5,
	"estoque": 100
}
```

	 - Obter produto
		 - Método: GET
		 - URL: `{{baseUrl}}/produtos/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Atualizar produto
		 - Método: PUT
		 - URL: `{{baseUrl}}/produtos/{{id}}`
		 - Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
		 - Body (exemplo):

```json
{
	"nome": "Caneta Azul XL",
	"preco": 4.0,
	"estoque": 120
}
```

	 - Deletar produto
		 - Método: DELETE
		 - URL: `{{baseUrl}}/produtos/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

7. Pedidos (protegido)

	 - Listar pedidos
		 - Método: GET
		 - URL: `{{baseUrl}}/pedidos`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Criar pedido
		 - Método: POST
		 - URL: `{{baseUrl}}/pedidos`
		 - Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
		 - Body (exemplo):

```json
{
	"usuario_id": 1,
	"items": [
		{ "produto_id": 1, "quantidade": 2 },
		{ "produto_id": 2, "quantidade": 1 }
	]
}
```

	 - Obter pedido
		 - Método: GET
		 - URL: `{{baseUrl}}/pedidos/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Deletar pedido
		 - Método: DELETE
		 - URL: `{{baseUrl}}/pedidos/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

8. Itens do pedido (protegido)

	 - Listar itens de um pedido
		 - Método: GET
		 - URL: `{{baseUrl}}/pedidos/{{pedido_id}}/itens`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Operação sobre itens (replace/add/remove) — atualização via PATCH
		 - Método: PATCH
		 - URL: `{{baseUrl}}/pedidos/{{pedido_id}}/itens`
		 - Headers: `Content-Type: application/json`, `Authorization: Bearer {{token}}`
		 - Body (exemplos):

			 * Remover item existente:

```json
{
	"acao": "remover",
	"produto_antigo_id": 2
}
```

			 * Substituir um produto por outro (replace):

```json
{
	"acao": "substituir",
	"produto_antigo_id": 2,
	"produto_novo_id": 3,
	"quantidade": 1,
	"preco": 10.0
}
```

			 * Adicionar novo item:

```json
{
	"acao": "adicionar",
	"produto_novo_id": 4,
	"quantidade": 2,
	"preco": 5.5
}
```

	 - Obter um item específico
		 - Método: GET
		 - URL: `{{baseUrl}}/pedidos/{{pedido_id}}/itens/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

	 - Remover um item específico
		 - Método: DELETE
		 - URL: `{{baseUrl}}/pedidos/{{pedido_id}}/itens/{{id}}`
		 - Headers: `Authorization: Bearer {{token}}`

9. Dica útil no Postman

	 - Para não repetir headers, você pode configurar `Authorization` no nível da Collection usando `Bearer {{token}}` como valor.

10. Importar coleção (opcional)

		- Se preferir, crie uma Collection JSON no Postman com as requisições acima e importe-a. Isso facilita compartilhar o conjunto de endpoints com a equipe.


## Desenvolvimento

- Código fonte em TypeScript no diretório `src/`.
- Prisma client gerado em `node_modules/.prisma` e helper em `src/prisma/client.ts`.
- Middlewares em `src/middlewares/`.
- Rotas em `src/routes/` e controllers em `src/controllers/`.

### Dicas rápidas

- Se alterar o arquivo `src/docs/swagger.ts`, reinicie o servidor para que as mudanças apareçam no Swagger UI.

## Erros comuns e soluções

- Erro: `Argument 'preco' is missing` ao criar itens de pedido — verifique se no payload de criação de itens você envia `preco` ou se o produto tem `preco` definido; o backend pode usar o preço do produto como fallback.
- Erro: Swagger não aparece — instale `swagger-ui-express` e `swagger-jsdoc` e reinicie o servidor.

## Contato

Se precisar de ajuda, pode entrar em contato comigo que estou a disposição.