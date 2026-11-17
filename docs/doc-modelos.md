# Documento de Modelos

Neste documento temos o modelo Conceitual (UML) ou de Dados (Entidade-Relacionamento). Temos também a descrição das entidades e o dicionário de dados.

Para a modelagem pode se usar o Astah UML ou o BrModelo. Uma ferramenta interessante para modelos UML é a [YUML](http://yuml.me), no link temos um exemplo de [Modelo UML com YUML](yuml/monitoria-yuml.md). Atualmente é possível usar a ferramenta **Mermaid** segundo o blog do GitHub [Include diagrams in your Markdown files with Mermaid](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/). A documentação do **Mermaid** pode ser encontrada em [Mermaid in GitHub](https://mermaid-js.github.io/mermaid).

## Modelo Conceitual

### Diagrama de Classes usando Mermaid

```mermaid
classDiagram
    class Funcionario {
        +int id
        +String nome
        +String email
        +String senha
        +String cargo
        +fazerLogin()
        +registrarVenda()
        +registrarPagamento()
    }

    class Cliente {
        +int id
        +String nome
        +String telefone
        +String endereco
        +cadastrarCliente()
        +consultarCliente()
        +alterarCliente()
        +excluirCliente()
    }

    class Fornecedor {
        +int id
        +String nome
        +String telefone
        +String endereco
        +cadastrarFornecedor()
        +consultarFornecedor()
        +alterarFornecedor()
        +excluirFornecedor()
    }

    class Produto {
        +int id
        +String nome
        +String categoria
        +String unidadeMedida
        +double precoVenda
        +int quantidade
        +int quantidadeMinima
        +cadastrarProduto()
        +consultarProduto()
        +alterarProduto()
        +excluirProduto()
    }

    class Venda {
        +int id
        +Date data
        +double valorTotal
        +String statusPagamento
        +registrarVenda()
        +consultarVenda()
        +alterarVenda()
        +cancelarVenda()
        +calcularTotal()
        +gerarRelatorio()
    }

    class ItemVenda {
        +int quantidade
        +double valorUnitario
        +double subtotal
        +calcularSubtotal()
    }

    class Pagamento {
        +int id
        +Date dataPagamento
        +double valor
        +String formaPagamento
        +String status
        +registrarPagamento()
        +consultarPagamento()
        +alterarPagamento()
        +cancelarPagamento()
    }

    class Conta {
        +int id
        +Date dataVencimento
        +double valor
        +String status
        +registrarConta()
        +consultarConta()
        +alterarConta()
        +cancelarConta()
    }

    class EntradaProduto {
        +int id
        +Date data
        +int quantidade
        +registrarEntradaProduto()
        +consultarEntradaProduto()
        +alterarEntradaProduto()
        +cancelarEntradaProduto()
    }

    Funcionario "1" -- "0..*" Venda
    Cliente "1" -- "0..*" Venda
    Venda "1" -- "1..*" ItemVenda
    Produto "1" -- "0..*" ItemVenda
    Venda "1" -- "0..*" Pagamento
    Venda "1" -- "0..1" Conta
    Fornecedor "1" -- "0..*" Produto
    Produto "1" -- "0..*" EntradaProduto
```

### Descrição das Entidades

Descrição sucinta das entidades presentes no sistema.

| Entidade | Descrição |
|----------|-----------|
| Funcionario | Representa os colaboradores da empresa responsáveis pela operação do sistema, autenticação e realização de vendas e pagamentos. |
| Cliente | Entidade que armazena as informações dos clientes atendidos nas operações de venda da empresa. |
| Fornecedor | Entidade que representa os fornecedores parceiros responsáveis pelo fornecimento de matérias-primas e produtos. |
| Produto | Representa os itens cadastrados no estoque (matérias-primas e produtos embalados), contendo dados sobre preços e quantidades em estoque. |
| Venda | Entidade central do processo de saída de mercadorias, responsável por agrupar os itens vendidos, calcular totais e status financeiro. |
| ItemVenda | Representa a associação entre um Produto específico e uma Venda, registrando a quantidade vendida e os valores parciais. |
| Pagamento | Armazena as informações relativas às transações financeiras e quitações efetuadas para vendas à vista. |
| Conta | Registra as informações relativas a contas a receber geradas para vendas efetuadas a prazo. |
| EntradaProduto | Registra formalmente a chegada e movimentação de entrada de produtos ao estoque, com quantidades e datas. |

---

## Modelo de Dados (Entidade-Relacionamento)

Para criar modelos ER é possível usar o BrModelo e gerar uma imagem. Contudo, atualmente é possível criar modelos ER usando a ferramenta **Mermaid**, escrevendo o modelo diretamente em markdown. Acesse a documentação para escrever modelos [ER Diagram Mermaid](https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram).

```mermaid
erDiagram
    FUNCIONARIO ||--o{ VENDA : realiza
    CLIENTE ||--o{ VENDA : possui
    FORNECEDOR ||--o{ PRODUTO : fornece
    PRODUTO ||--o{ ENTRADA_PRODUTO : recebe
    PRODUTO ||--o{ ITEM_VENDA : composto_por
    VENDA ||--|{ ITEM_VENDA : contem
    VENDA ||--o{ PAGAMENTO : gera
    VENDA ||--o| CONTA : gera

    FUNCIONARIO {
        int id PK
        string nome
        string email
        string senha
        string cargo
    }

    CLIENTE {
        int id PK
        string nome
        string telefone
        string endereco
    }

    FORNECEDOR {
        int id PK
        string nome
        string telefone
        string endereco
    }

    PRODUTO {
        int id PK
        string nome
        string categoria
        string unidadeMedida
        double precoVenda
        int quantidade
        int quantidadeMinima
        int fornecedor_id FK
    }

    ENTRADA_PRODUTO {
        int id PK
        date data
        int quantidade
        int produto_id FK
    }

    VENDA {
        int id PK
        date data
        double valorTotal
        string statusPagamento
        int funcionario_id FK
        int cliente_id FK
    }

    ITEM_VENDA {
        int venda_id FK
        int produto_id FK
        int quantidade
        double valorUnitario
        double subtotal
    }

    PAGAMENTO {
        int id PK
        date dataPagamento
        double valor
        string formaPagamento
        string status
        int venda_id FK
    }

    CONTA {
        int id PK
        date dataVencimento
        double valor
        string status
        int venda_id FK
    }
```

### Dicionário de Dados

| Tabela | PRODUTO |
| ---------- | ----------- |
| Descrição | Armazena as informações dos produtos e matérias-primas gerenciados no estoque da empresa. |
| Observação | Os produtos podem estar em estado bruto (matéria-prima) ou embalados para comercialização. |

| Nome | Descrição | Tipo de Dado | Tamanho | Restrições de Domínio |
| ------------- | -------------------------------- | ------------ | ------- | --------------------- |
| id | identificador gerado pelo SGBD | SERIAL | --- | PK / Identity |
| nome | nome do produto ou tempero | VARCHAR | 150 | Not Null |
| categoria | categoria do item (Ex: Matéria-prima, Embalado) | VARCHAR | 50 | Not Null |
| unidadeMedida | unidade de medida (Ex: kg, un, pct) | VARCHAR | 15 | Not Null |
| precoVenda | preço de venda unitário | NUMERIC | 10,2 | Not Null / >= 0 |
| quantidade | quantidade atual disponível em estoque | INTEGER | --- | Not Null / >= 0 |
| quantidadeMinima| estoque mínimo para alerta de reposição | INTEGER | --- | Not Null / >= 0 |
| fornecedor_id | código do fornecedor do produto | SERIAL | --- | FK / Not Null |

---

| Tabela | VENDA |
| ---------- | ----------- |
| Descrição | Armazena o cabeçalho das transações de vendas efetuadas aos clientes. |
| Observação | Contém a relação com o funcionário que realizou a operação e com o cliente comprador. |

| Nome | Descrição | Tipo de Dado | Tamanho | Restrições de Domínio |
| ------------- | -------------------------------- | ------------ | ------- | --------------------- |
| id | identificador gerado pelo SGBD | SERIAL | --- | PK / Identity |
| data | data e hora em que a venda foi efetuada | TIMESTAMP | --- | Not Null |
| valorTotal | valor total da venda | NUMERIC | 10,2 | Not Null / >= 0 |
| statusPagamento| status atual do pagamento da venda | VARCHAR | 30 | Not Null |
| funcionario_id| código do funcionário responsável | SERIAL | --- | FK / Not Null |
| cliente_id | código do cliente comprador | SERIAL | --- | FK / Not Null |

---

| Tabela | ITEM_VENDA |
| ---------- | ----------- |
| Descrição | Detalha cada produto vinculado a uma determinada venda. |
| Observação | Permite a composição de múltiplos itens em um único registro de venda. |

| Nome | Descrição | Tipo de Dado | Tamanho | Restrições de Domínio |
| ------------- | -------------------------------- | ------------ | ------- | --------------------- |
| venda_id | identificador da venda associada | SERIAL | --- | PK / FK / Not Null |
| produto_id | identificador do produto associado | SERIAL | --- | PK / FK / Not Null |
| quantidade | quantidade vendida do produto | INTEGER | --- | Not Null / > 0 |
| valorUnitario | valor do produto no momento da venda | NUMERIC | 10,2 | Not Null / > 0 |
| subtotal | cálculo de quantidade x valor unitário | NUMERIC | 10,2 | Not Null / > 0 |