# Documento de Visão - Sistema Comcil (Módulo de Clientes)

## Histórico de Revisões

| Data | Versão | Descrição | Autor |
| :--- | :--- | :--- | :--- |
| 05/11/2026 | 1.0 | Elaboração inicial do Documento de Visão com foco no CRUD de Clientes | Daniel Mariz, Jonas Jerônimo, Gabriel Samir, Leandro Isaac |

---

## 1. Visão Geral do Produto

### 1.1 Declaração do Problema

| Elemento | Descrição |
| :--- | :--- |
| **O problema de** | Ausência de um cadastro informatizado e centralizado de clientes e do histórico de movimentações comerciais da empresa Comcil. |
| **afeta** | Os vendedores, operadores operacionais e a gestão da empresa. |
| **cujo impacto é** | Dificuldade em vincular vendas aos compradores corretos, inconsistência de dados cadastrais e perda de tempo em buscas manuais. |
| **uma solução de sucesso seria** | Uma aplicação web com interface intuitiva que permita o cadastro, consulta, atualização e desativação lógica de clientes (CRUD completo). |

### 1.2 Declaração da Posição do Produto

| Elemento                                | Descrição |
| ----------------------------------------| ---------------------------------------------------------------------------------------------- |
| **Para**                                | A equipe de vendas e operação da empresa Comcil.                                               |
| **Que**                                 | Necessitam de uma gestão rápida, organizada e segura das informações dos clientes cadastrados. |
| **O Sistema Comcil (Módulo Clientes)**  | É um sistema web de gestão administrativa.                                                     |
| **Que**                                 | Disponibiliza um CRUD completo para controle cadastral de clientes (Manter cliente).           |
| **Diferente de**                        | Anotações manuais em cadernos ou planilhas descentralizadas.                                   |
| **Nosso produto**                       | Garante rápida resposta visual em Next.js com Tailwind CSS, integridade referencial e facilidade de manutenção|

---

## 2. Perfis dos Envolvidos e dos Usuários

### 2.1 Resumo dos Envolvidos (Stakeholders)

| Nome | Descrição | Responsabilidade no Projeto |
| :--- | :--- | :--- |
| **Equipe de Desenvolvimento** | Daniel Mariz da Silva, Jonas Jerônimo Cirilo Silva, Gabriel Samir e Leandro Isaac[cite: 2, 6, 7] | Planejamento Scrum, documentação, desenvolvimento da interface em Next.js e lógica do CRUD de Clientes[cite: 1, 3, 4]. |
| **Empresa Comcil** | Empresa familiar potiguar de embalagem e distribuição de temperos[cite: 9] | Contexto de negócio e requisitos definidos no relatório de OSM[cite: 7, 10]. |
| **Professora** | Profª Karliane Medeiros Ovidio Vale[cite: 1, 7] | Avaliação acadêmica, acompanhamento dos entregáveis e revisões de Sprint[cite: 1, 4, 5]. |

### 2.2 Resumo dos Usuários

| Usuário | Descrição | Responsabilidades |
| :--- | :--- | :--- |
| **Vendedor / Operador** | Usuário operacional da Comcil[cite: 9, 12] | Cadastrar novos clientes, atualizar dados de contato/endereço, realizar buscas por nome ou código e gerenciar inativações cadastrais[cite: 22, 23]. |

---

## 3. Requisitos do Sistema

### 3.1 Requisitos Funcionais (RF)

| Código   |           Nome           |    Descrição                   | Prioridade |
| -------- | -------------------------| -------------------------------| ---------- |
| **RF01** | Cadastrar Cliente        | Permitir o registro de um novo cliente informando nome, telefone e endereço. | *Alta* |
| **RF02** | Consultar Cliente        | Permitir a listagem e busca de clientes cadastrados por código ou nome. | *Alta* |
| **RF03** | Alterar Cliente          | Permitir a edição dos dados cadastrais (nome, telefone, endereço) de um cliente existente. | *Alta* |
| **RF04** | Excluir/Inativar Cliente | Permitir a remoção do cliente do sistema ou a sua inativação lógica caso possua vendas vinculada. | *Alta* |

### 3.2 Requisitos Não-Funcionais (RNF)

| Código    |              Nome             |    Descrição    | Categoria |
| --------- | ----------------------------- | --------------- | --------- |
| **RNF01** | Interface Simples e Intuitiva | Desenvolvida em Next.js (JavaScript) utilizando componentes estilizados com Tailwind CSS para garantir acessibilidade e responsividade. | *Usabilidade* |
| **RNF02** | Integridade dos Dados | Impedir o cadastro de clientes duplicados e garantir a validação de campos obrigatórios (nome e identificação). | Confiabilidade |
| **RNF03** | Regra de Exclusão Lógica | Clientes vinculados a vendas registradas não devem ser excluídos fisicamente do banco de dados, permitindo apenas a sua inativação. | Regra de Negócio |

---

## 4. Restrições do Projeto

* A aplicação deve ser desenvolvida utilizando o framework **Next.js** com **JavaScript**[cite: 3].
* O foco prioritário da implementação funcional para a avaliação da disciplina é o **CRUD de Clientes** (Manter cliente)[cite: 3, 12, 22].
* O projeto deve cumprir o cronograma estipulado nas Sprints (Sprint 1 até 12/11, Sprint 2 até 19/11 e Apresentação de 23 a 26/11)[cite: 4, 5].