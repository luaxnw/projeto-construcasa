# Construcasa

Sistema web para uma loja de materiais de construção de Chapecó. Controla clientes, produtos, categorias, pedidos e estoque, e tem um dashboard com o resumo da loja.

Trabalho Integrador de GEX1215 – Desenvolvimento de Sistemas Web (UFFS, 2026). Autores: Rafael Knebel e Luan Luiz da Silva Pescador.

## Tecnologias

- Banco: PostgreSQL 14 ou superior (com pgAdmin)
- Backend: Node.js, Express, Sequelize, pg, bcrypt, jsonwebtoken, Passport (passport-jwt), dotenv, cors
- Frontend: React, Vite, React Router, Bootstrap, React-Bootstrap, Material UI

## O que precisa ter instalado

- Node.js 20 ou superior
- PostgreSQL com pgAdmin 4, rodando na porta 5432
- A senha do usuário `postgres` (definida na instalação)

## Como rodar

### 1. Criar o banco

No pgAdmin: botão direito em **Databases** > **Create** > **Database**. Nome: `construcasa`. Clique em **Save**.

### 2. Rodar o script SQL

1. Botão direito no banco `construcasa` > **Query Tool**.
2. Clique no ícone de abrir arquivo e escolha `backend/database/construcasa.sql`.
3. Execute com F5.

O script cria as tabelas e os dados iniciais (perfis, unidades de medida e dois usuários). Para conferir, rode `SELECT nome, cpf FROM funcionarios;`. Devem aparecer 2 linhas.

### 3. Criar o `backend/.env`

Crie o arquivo `.env` dentro da pasta `backend` (ao lado do `main.js`):

```
DB_NAME=construcasa
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=troque_por_um_texto_longo
JWT_EXPIRES_IN=1h
```
Troque `SUA_SENHA_DO_POSTGRES` pela senha do `postgres`. No Windows, salve pelo Bloco de Notas com o tipo "Todos os arquivos", senão vira `.env.txt`.

Ou cole no terminal:

```
cat > .env <<'ENV'
DB_NAME=construcasa
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_DO_POSTGRES
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=troque_por_um_texto_longo
JWT_EXPIRES_IN=1h
ENV
cat .env
```

### 4. Backend

```bash
cd backend
npm install
npm run dev
```

Deve aparecer `Servidor rodando em http://localhost:3001`. Deixe o terminal aberto.

### 5. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. Use exatamente esse endereço, porque o backend só libera CORS para ele.

### 6. Login

| Perfil | CPF | Senha |
| --- | --- | --- |
| Administrador | 000.000.000-00 | admin123 |
| Vendedor | 111.111.111-11 | vendedor123 |

São usuários de teste. O sistema começa sem clientes, produtos e pedidos, então cadastre alguns.

## Refazer o banco do zero

Pare o backend, apague o banco `construcasa` no pgAdmin (botão direito > **Delete**) e repita os passos 1 e 2.

## Problemas comuns

- **`password authentication failed` no backend:** `DB_PASSWORD` ou `DB_USER` errado no `.env`. Corrija e reinicie o backend.
- **No log aparece `injected env (0)`:** o `.env` está vazio ou na pasta errada.
- **"Failed to fetch" no login:** o backend não está rodando, ou o frontend abriu em outra porta que não a 5173.
- **"Credenciais inválidas":** confira o CPF e a senha da tabela acima, e se o script SQL foi executado no banco `construcasa`.
- **`database "construcasa" already exists`:** o banco já existe. Pule o passo 1.

## Estrutura

```
backend/
  auth/ clientes/ categorias/ produtos/ pedidos/
  funcionarios/ unidades-medida/ dashboard/   (routes, controller, service e repository)
  database/construcasa.sql                    tabelas e dados iniciais
  database/connection.js                      conexão com o banco
  main.js                                     servidor (porta 3001)
frontend/
  src/pages  src/components  src/contexts  src/styles
```
