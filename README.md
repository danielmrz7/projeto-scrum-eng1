# Projeto Prático: Sistema Comcil - Módulo de Gestão de Clientes

Este repositório contém o projeto de software desenvolvido para a disciplina de **Engenharia de Software I** (UFRN/CERES), sob a orientação da **Profª. Karliane Medeiros Ovidio Vale**. O projeto aplica a metodologia ágil **Scrum** para a implementação de um sistema web fundamentado na análise organizacional desenvolvida na disciplina de **Organização, Sistemas e Métodos (OSM)** para a empresa **Comcil** (embalagem e distribuição de temperos).

---

## 🛠️ Tecnologias Utilizadas

- **Framework Fullstack/Web:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** JavaScript (ES6+)
- **Estilização:** Tailwind CSS (configuração rápida e utilitária)
- **Gerenciador de Pacotes:** npm
- **Gestão de Projeto e Versão:** Git, GitHub e GitHub Projects (Board Kanban)

---

## 📁 Estrutura do Repositório

```text
.
├── docs/                 # Documentação de Engenharia de Software
│   ├── doc-visao.md      # Documento de Visão do Sistema
│   └── doc-modelos.md    # Documento de Modelos (Classes, Casos de Uso, Sequência)
├── src/                  # Código-fonte da aplicação Next.js (App Router)
│   ├── app/              # Páginas e rotas da aplicação (ex: /clientes)
│   ├── components/       # Componentes reutilizáveis (Tabelas, Formulários, Modais)
│   └── services/         # Lógica de integração e persistência do CRUD de Clientes
├── public/               # Recursos estáticos (Logótipo Comcil, ícones)
├── README.md             # Documentação principal do repositório
└── package.json          # Dependências do projeto