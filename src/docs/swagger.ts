const swaggerSpec: any = {
    openapi: '3.0.0',
    info: {
        title: 'API - Teste Manto Sistemas',
        version: '1.0.0',
        description: 'Documentação completa da API'
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
        { name: 'Auth', description: 'Autenticação e registro' },
        { name: 'Usuarios', description: 'Gerenciamento de usuários' },
        { name: 'Produtos', description: 'Gerenciamento de produtos' },
        { name: 'Pedidos', description: 'Gerenciamento de pedidos' },
        { name: 'ItensPedido', description: 'Operações sobre itens de pedido' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        parameters: {
            idParam: {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'ID numérico'
            },
            pedidoIdParam: {
                name: 'pedido_id',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'ID do pedido'
            }
        },
        responses: {
            Unauthorized: { description: 'Não autenticado (token inválido ou ausente)' },
            BadRequest: { description: 'Requisição inválida' },
            NotFound: { description: 'Recurso não encontrado' }
        },
        schemas: {
            Usuario: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nome: { type: 'string' },
                    email: { type: 'string' },
                    cep: { type: 'string' },
                    rua: { type: 'string' },
                    bairro: { type: 'string' },
                    cidade: { type: 'string' },
                    estado: { type: 'string' }
                }
            },
            Produto: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nome: { type: 'string' },
                    preco: { type: 'number' },
                    estoque: { type: 'integer' }
                }
            },
            PedidoItem: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    pedido_id: { type: 'integer' },
                    produto_id: { type: 'integer' },
                    quantidade: { type: 'integer' },
                    preco: { type: 'number' }
                }
            },
            Pedido: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    usuario_id: { type: 'integer' },
                    total: { type: 'number' },
                    itens: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PedidoItem' }
                    }
                }
            }
        }
    },
    paths: {
        // 🔐 AUTH
        '/auth/registro': {
            post: {
                tags: ['Auth'],
                summary: 'Registrar usuário',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    email: { type: 'string' },
                                    senha: { type: 'string' },
                                    cep: { type: 'string' }
                                },
                                required: ['nome', 'email', 'senha']
                            },
                            example: {
                                nome: 'Maria Silva',
                                email: 'maria@example.com',
                                senha: 'senha123',
                                cep: '01001000'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Usuário criado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Usuario' }
                            }
                        }
                    },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Autenticar usuário',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    senha: { type: 'string' }
                                },
                                required: ['email', 'senha']
                            },
                            example: { email: 'maria@example.com', senha: 'senha123' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Token JWT gerado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { token: { type: 'string' } }
                                }
                            }
                        }
                    },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },
        // 👤 USUÁRIOS
        '/usuarios': {
            get: {
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                summary: 'Listar usuários',
                description: 'Retorna todos os usuários do sistema. Pode ser filtrado/ paginado no futuro.',
                responses: {
                    200: {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Usuario' }
                                },
                                example: [
                                    {
                                        id: 1,
                                        nome: 'Maria Silva',
                                        email: 'maria@example.com',
                                        cep: '01001-000',
                                        rua: 'Praça da Sé',
                                        bairro: 'Sé',
                                        cidade: 'São Paulo',
                                        estado: 'SP'
                                    }
                                ]
                            }
                        }
                    },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },
        '/usuarios/{id}': {
            get: {
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                summary: 'Obter um usuário pelo ID',
                responses: {
                    200: {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Usuario' },
                                example: {
                                    id: 1,
                                    nome: 'Maria Silva',
                                    email: 'maria@example.com',
                                    cep: '01001-000',
                                    rua: 'Praça da Sé',
                                    bairro: 'Sé',
                                    cidade: 'São Paulo',
                                    estado: 'SP'
                                }
                            }
                        }
                    },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            },
            put: {
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                summary: 'Atualizar um usuário',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    email: { type: 'string' },
                                    senha: { type: 'string' },
                                    cep: { type: 'string' },
                                    rua: { type: 'string' },
                                    bairro: { type: 'string' },
                                    cidade: { type: 'string' },
                                    estado: { type: 'string' }
                                }
                            },
                            example: {
                                nome: 'Maria Silva Atualizada',
                                email: 'maria.nova@example.com',
                                cep: '01001-000'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Usuário atualizado',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Usuario' }
                            }
                        }
                    },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            },
            delete: {
                tags: ['Usuarios'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                summary: 'Deletar um usuário',
                responses: {
                    204: { description: 'Usuário deletado' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            }
        },
        // 🛒 PRODUTOS
        '/produtos': {
            get: {
                tags: ['Produtos'],
                security: [{ bearerAuth: [] }],
                summary: 'Listar produtos',
                responses: {
                    200: {
                        description: 'Lista de produtos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Produto' }
                                }
                            }
                        }
                    },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            },
            post: {
                tags: ['Produtos'],
                security: [{ bearerAuth: [] }],
                summary: 'Criar produto',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    preco: { type: 'number' },
                                    estoque: { type: 'integer' }
                                },
                                required: ['nome', 'preco']
                            },
                            example: { nome: 'Caneta Azul', preco: 3.5, estoque: 100 }
                        }
                    }
                },
                responses: {
                    201: { description: 'Produto criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },
        '/produtos/{id}': {
            get: {
                tags: ['Produtos'],
                security: [{ bearerAuth: [] }],
                parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
                summary: 'Obter produto por ID',
                responses: {
                    200: { description: 'Produto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
                    404: { $ref: '#/components/responses/NotFound' },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            },
            put: {
                tags: ['Produtos'],
                security: [{ bearerAuth: [] }],
                parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
                summary: 'Atualizar produto',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    preco: { type: 'number' },
                                    estoque: { type: 'integer' }
                                }
                            },
                            example: { nome: 'Caneta Azul XL', preco: 4.0, estoque: 120 }
                        }
                    }
                },
                responses: {
                    200: { description: 'Produto atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    404: { $ref: '#/components/responses/NotFound' }
                }
            },
            delete: {
                tags: ['Produtos'],
                security: [{ bearerAuth: [] }],
                parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'integer' } } ],
                summary: 'Remover produto',
                responses: { 200: { description: 'Produto removido' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' } }
            }
        },
        '/pedidos': {
            get: {
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                summary: 'Listar pedidos',
                responses: {
                    200: {
                        description: 'Lista de pedidos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Pedido' }
                                }
                            }
                        }
                    },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            },
            post: {
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                summary: 'Criar pedido',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    usuario_id: { type: 'integer' },
                                    items: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                produto_id: { type: 'integer' },
                                                quantidade: { type: 'integer' },
                                                preco: { type: 'number' }
                                            },
                                            required: ['produto_id', 'quantidade']
                                        }
                                    }
                                },
                                required: ['usuario_id', 'items']
                            },
                            example: {
                                usuario_id: 1,
                                items: [
                                    { produto_id: 1, quantidade: 2 },
                                    { produto_id: 2, quantidade: 1 }
                                ]
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Pedido criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
                    400: { $ref: '#/components/responses/BadRequest' },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },

        '/pedidos/{id}': {
        get: {
            tags: ['Pedidos'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            responses: {
            200: {
                description: 'Pedido encontrado',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Pedido' }
                    }
                }
            },
            403: { description: 'Acesso negado' },
            404: { description: 'Não encontrado' }
            }
        },
        put: {
            tags: ['Pedidos'],
            security: [{ bearerAuth: [] }],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': { schema: { type: 'object' } }
                }
            },
            responses: {
                200: {
                    description: 'Pedido atualizado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Pedido' }
                        }
                    }
                }
            }
        },
        delete: {
            tags: ['Pedidos'],
            security: [{ bearerAuth: [] }],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            responses: { 200: { description: 'Pedido removido' } }
        }
        },

        // ITENS DO PEDIDO
        '/itens-pedidos/{pedido_id}/itens': {
        get: {
            tags: ['ItensPedido'],
            security: [{ bearerAuth: [] }],
            parameters: [{
                name: 'pedido_id',
                in: 'path',
                required: true,
                schema: { type: 'integer' }
            }],
            responses: {
                200: {
                    description: 'Itens do pedido',
                    content: {
                        'application/json': {
                            schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/PedidoItem' }
                            }
                        }
                    }
                }
            }
        },
        patch: {
            tags: ['ItensPedido'],
            security: [{ bearerAuth: [] }],
            parameters: [{
                name: 'pedido_id',
                in: 'path',
                required: true,
                schema: { type: 'integer' }
            }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            description: "Operações suportadas: 'adicionar' (produto_novo_id, quantidade, preco opcional), 'remover' (produto_antigo_id), 'substituir' (produto_antigo_id, produto_novo_id, quantidade, preco opcional).",
                            properties: {
                                acao: { type: 'string', description: "Ação a executar", enum: ['adicionar','remover','substituir'] },
                                produto_antigo_id: { type: 'integer' },
                                produto_novo_id: { type: 'integer' },
                                quantidade: { type: 'integer' },
                                preco: { type: 'number' }
                            },
                            required: ['acao']
                        },
                        example: { acao: 'substituir', produto_antigo_id: 2, produto_novo_id: 3, quantidade: 1, preco: 10.0 }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Operação realizada',
                    content: {
                        'application/json': {
                            schema: {
                            oneOf: [
                                { $ref: '#/components/schemas/PedidoItem' },
                                {
                                type: 'object',
                                properties: { message: { type: 'string' } }
                                }
                            ]
                            }
                        }
                    }
                }
            }
        }
        },
        '/itens-pedidos/{pedido_id}/itens/{id}': {
        get: {
            tags: ['ItensPedido'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'pedido_id', in: 'path', required: true, schema: { type: 'integer' } },
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            responses: {
            200: {
                description: 'Item encontrado',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/PedidoItem' }
                    }
                }
            },
            404: { description: 'Não encontrado' }
            }
        },
        delete: {
            tags: ['ItensPedido'],
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'pedido_id', in: 'path', required: true, schema: { type: 'integer' } },
                { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
            ],
            responses: { 204: { description: 'Item removido' } }
        }
        }
    }
};

export default swaggerSpec;
