# IBPV Front-end (Vue + PrimeVue)

## 🧭 Descrição
Este front-end em **Vue.js** com **PrimeVue** consome a **API do IBPV**, permitindo aos usuários gerenciar:

- **Membros** — adicionar, editar, visualizar e excluir registros  
- **Bloquear Periodos** — Permitir Bloqueio de periodos, e dupla verificação para alterações
- **Gastos** — controlar despesas da igreja  --feito 
- **Contribuições** — gerenciar doações e arrecadações  -- feito
- **Caixa e relatórios** — visualizar saldos e gerar relatórios financeiros  Em Andamento

O objetivo é fornecer uma interface leve, responsiva e intuitiva, mantendo toda a lógica de negócio centralizada na API.

## ⚙️ Stack Principal
- **Vue.js** — framework front-end  
- **PrimeVue** — biblioteca de componentes UI  

## 🧩 Funcionalidades Principais
- Tela de login e autenticação - feito
- Layout moderno e responsivo - feito
  - Navbar fluida para mobile e desktop - feito
  - Header polido com logotipo e acesso ao perfil - feito
- CRUD de Membros, Gastos, Contribuições e Caixa - feito
- Bloqueio de período financeiro
- Relatórios financeiros detalhados - feito

## 🔄 Planejamento
O projeto será desenvolvido por etapas curtas e incrementais, com foco em:

1. Estrutura inicial e autenticação - feito
2. Layout base e navegação   - feito
3. Módulos (Membros, Gastos, Contribuições, Caixa)   - feito
4. Relatórios e travamento de período   
5. Refino visual - feito
6. documentação - feito



## 🔄 Manutenções futuras

1. Manejo do token (bug de n redirecionar para login e retornar serviço inválido).
2. Erros e a abertura de telas (como o erro é um modal a parte, o modal que causa o erro continua aberto e as vezes com os dados antigos) resolver isso.
3. sistema de imagem deve avisar limite e substituir automaticamente a imagem quando houver somente uma.
4. ao inserir o cep no fomr de membro deve buscar o endereço na api do via cep.
5. refatorar a edição de membros padronizar os dtos e melhorar a questão das imagens.
6. ao editar nao recarregar toda a pagina apenas editar o item e manter
7. Rever os códigos de erro back e front
8. Loading em usuarios
9. adicionar melhoria de navegação no unlock, fazer a barra de progresso subir esperar uns segundos e fechar, e permitir erros

## 🔄 Features futuras

1. Redefinir senha nativo
2. Futuramente navegar melhor por periodos bloqueados - ou seja, mostrar qual perido esta bloqueando a mudança / transação




## 🧑‍💻 Autor
**Sergio Pimenta** — Projeto voluntário e de aprimoramento técnico.
