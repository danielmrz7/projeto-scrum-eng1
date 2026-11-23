# Projeto Prático: Sistema Comcil – Módulo de Gestão de Clientes

Projeto da disciplina de **Engenharia de Software I** (UFRN/CERES), orientado pela **Profª. Karliane Medeiros Ovidio Vale**. Aplica **Scrum** na implementação do módulo de clientes do *Sistema de Administração de Estoque* da empresa **Comcil** (embalagem e distribuição de temperos), proposto na disciplina de **Organização, Sistemas e Métodos (OSM)**.

## Tecnologias
Next.js 14 (App Router) · JavaScript · Tailwind CSS · SQLite (better-sqlite3) · npm · Git/GitHub Projects (Kanban)

## Como executar
```bash
npm install
npm run dev   # http://localhost:3000  (redireciona para /login)
```
O banco SQLite é criado automaticamente em `data/comcil.db` na primeira execução (caminho alterável pela variável `DB_PATH`).
No primeiro acesso é criado um administrador:

| E-mail | Senha |
| --- | --- |
| `admin@comcil.com.br` | `comcil123` |

Altere a senha após entrar (ou defina `ADMIN_EMAIL` / `ADMIN_SENHA` antes da primeira execução). Se existir um `data/clientes.json` da versão anterior, os clientes são importados automaticamente para o banco.

## Funcionalidades

### US01 – Autenticação
- **RF01.01** Login com e-mail e senha: formato do e-mail validado, senhas guardadas com hash *scrypt* (nunca em texto puro), mensagem genérica para credenciais inválidas e bloqueio temporário após 5 tentativas erradas.
- **RF01.02** Funcionários inativos não conseguem entrar e suas sessões abertas são encerradas.
- **RF01.03** Logout encerra a sessão no banco e apaga o cookie.
- **RNF003** Todas as telas e APIs exigem sessão válida (cookie `HttpOnly`, validade de 8 h).

### US02 – Produtos (`/produtos`)
- Cadastrar, consultar (por nome/código, categoria e situação do estoque), alterar e excluir.
- Validações: nome, categoria e unidade obrigatórios; preço e quantidades numéricos e não negativos; sem duplicidade.
- Com histórico de vendas ou entradas o produto é apenas **inativado**. A tela inicial avisa quando há produtos no estoque mínimo ou abaixo dele.

### US04 – Clientes (`/clientes`)
- **RF04.01** Cadastrar · **RF04.02** Consultar por nome ou código · **RF04.03** Alterar
- **RF04.04** Excluir: com vendas vinculadas o cliente é apenas **inativado**; sem vendas, é excluído. Clientes inativos podem ser reativados.
- Validações: nome obrigatório e bloqueio de duplicidade (mesmo nome + telefone).

### Funcionários (`/funcionarios`, somente Administrador)
- Cadastrar, consultar, alterar, inativar/reativar e excluir funcionários (cargos: Administrador ou Vendedor).
- E-mail único; senha com no mínimo 6 caracteres, letras e números (em branco na edição mantém a atual).
- Não é possível excluir/inativar o próprio usuário nem ficar sem nenhum administrador ativo. Funcionário com vendas é apenas inativado.

## Estrutura
```text
.
├── docs/                              # Documento de Visão e Documento de Modelos
├── data/                              # Banco SQLite (ignorado pelo Git)
├── src/
│   ├── app/login/                     # Tela de login
│   ├── app/(sistema)/                 # Telas protegidas: início, clientes, produtos, funcionários
│   ├── app/api/                       # API Routes: auth, clientes, produtos, funcionarios
│   ├── components/                    # Navegação, formulários e tabelas
│   ├── lib/db.js                      # Conexão e esquema do banco (tabelas do doc de modelos)
│   ├── lib/auth.js                    # Login, sessão e proteção de rotas
│   └── services/                      # Regras de negócio de cada módulo
└── package.json
```
