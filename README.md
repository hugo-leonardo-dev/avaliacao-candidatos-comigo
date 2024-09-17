# Gerenciamento de Tickets

## Descrição do Projeto

A aplicação de gerenciamento de tickets desenvolvida para a Comigotech visa simplificar o fluxo de trabalho relacionado ao gerenciamento de tickets. Ela permite a criação, edição, exclusão e visualização de tickets, com suporte a diferentes papéis de usuário e permissões. O sistema inclui um back-end em Node.js com Prisma para gerenciamento de banco de dados e uma API RESTful para comunicação com o front-end.

# Backend

## Pré-requisitos

Certifique-se de ter o seguinte instalado em sua máquina:

- **Node.js:** Recomendado a versão LTS mais recente. [Baixe aqui](https://nodejs.org/).
- **PostgreSQL:** Banco de dados relacional usado pelo Prisma. [Baixe aqui](https://www.postgresql.org/download/).
- **Prisma CLI:** Ferramenta para gerenciar o esquema do banco de dados. [Documentação Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch).

## Preparar o Ambiente

### Clone o Repositório
Clone o repositório do projeto para sua máquina local usando o comando Git:

    git clone https://github.com/hugo-leonardo-dev/avaliacao-candidatos-comigo
    cd avaliacao-candidatos-comigo

### Configurar o Banco de Dados
Configure o acesso ao banco de dados PostgreSQL (ou outro banco de dados suportado). Crie um banco de dados e atualize o arquivo .env na raiz do projeto com a string de conexão. Exemplo de configuração para PostgreSQL:

      DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/NOME_DO_BANCO"

## Instalar as Dependências
### Instalar Dependências do Projeto
Navegue até o diretório do projeto e instale as dependências do Node.js:

      npm install
      # ou
      yarn install

### Instalar Dependências de Desenvolvimento
O projeto pode precisar de dependências adicionais para testes e outras funcionalidades. Instale também as dependências de desenvolvimento:

      npm install --save-dev
      # ou
      yarn add --dev

## Configuração do Prisma
### Gerar o Esquema do Banco de Dados
Gere e aplique as migrações do banco de dados usando o Prisma:

      npx prisma migrate deploy
      
Este comando cria as tabelas e esquemas necessários no banco de dados.

### Gerar o Cliente Prisma
Gere o cliente Prisma que será usado para interagir com o banco de dados:

      npx prisma generate
      
## Rodar o Projeto
### Iniciar o Servidor
Para iniciar o servidor Node.js, execute o comando:

      npm start
      # ou
      yarn start

O servidor estará disponível em http://localhost:3000 por padrão.

### Rodar Testes (Opcional)
Caso queira executar os testes para garantir que o sistema está funcionando corretamente, use:

      npm test
      # ou
      yarn test

# Front-End
A aplicação front-end é desenvolvida em React com Tailwind CSS. As principais funcionalidades do front-end incluem:

> Criação e Edição de Tickets: Formulário dividido em abas para facilitar a entrada de dados. Inclui validação e formatação de datas.
> Listagem e Filtros de Tickets: Exibe uma tabela com opções de filtragem por status, tipo, motivo, cliente e veículo.
> Autenticação e Proteção de Rotas: Protege rotas com base no estado de autenticação do usuário. Redireciona usuários não autenticados para a página de login.

## Rodar o Front-End
Para iniciar o front-end, navegue até o diretório frontend (ou nome similar) e execute:
  
    npm start
    # ou
    yarn start
    
O front-end estará disponível em http://localhost:3001 por padrão.

## Endpoints da API:
  > A aplicação expõe uma API RESTful para gerenciamento de tickets. Consulte a documentação da API para detalhes sobre os endpoints disponíveis, como criar, editar, excluir e listar tickets.
## Autenticação: 
  > O sistema requer autenticação JWT para proteger os endpoints. Certifique-se de obter um token de autenticação válido ao fazer requisições.
## Permissões: 
  > A aplicação tem suporte a diferentes papéis de usuário, como Admin e Atendente. As permissões são gerenciadas para garantir que apenas usuários autorizados possam acessar certas funcionalidades.
