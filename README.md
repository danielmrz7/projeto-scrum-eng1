# Projeto Prático: Sistema Comcil – Módulo de Gestão de Clientes

Projeto da disciplina de **Engenharia de Software I** (UFRN/CERES), orientado pela **Profª. Karliane Medeiros Ovidio Vale**. Aplica **Scrum** na implementação do módulo de clientes do *Sistema de Administração de Estoque* da empresa **Comcil** (embalagem e distribuição de temperos), proposto na disciplina de **Organização, Sistemas e Métodos (OSM)**.

## Tecnologias
Next.js 14 (App Router) · JavaScript · Tailwind CSS · npm · Git/GitHub Projects (Kanban)

## Como executar
```bash
npm install
npm run dev   # http://localhost:3000  (redireciona para /clientes)
```
Os dados ficam em `data/clientes.json` (criado automaticamente). Para simular a regra de inativação, crie `data/vendas.json` com `[{ "clienteId": 1 }]`.

## Funcionalidades (CRUD de Clientes)
- **RF01** Cadastrar · **RF02** Consultar por nome ou código · **RF03** Alterar
- **RF04** Excluir: com vendas vinculadas o cliente é apenas **inativado**; sem vendas, é excluído. Clientes inativos podem ser reativados.
- Validações: nome obrigatório e bloqueio de duplicidade (mesmo nome + telefone).

## Estrutura
```text
.
├── docs/                         # Documento de Visão e Documento de Modelos
├── data/                         # Persistência em JSON (ignorada pelo Git)
├── src/
│   ├── app/clientes/page.js      # Tela /clientes
│   ├── app/api/clientes/         # API Routes (GET, POST, PUT, DELETE)
│   ├── components/               # ClienteTable, ClienteForm
│   └── services/clienteService.js# Regras de negócio e persistência
└── package.json
```
