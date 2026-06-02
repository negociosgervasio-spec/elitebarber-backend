# Backend - Elite Barber

API Node.js com Express e MongoDB para gerenciar agendamentos e mensagens da barbearia.

## Visão geral

- Rota de agendamentos: `POST /api/schedules`, `GET /api/schedules`, `GET /api/schedules/:id`, `PUT /api/schedules/:id`, `DELETE /api/schedules/:id`
- Rota de mensagens: `POST /api/messages/create`
- CORS configurado para permitir o frontend em Vercel e localhost

## Pré-requisitos

- Node.js 18+ instalado
- MongoDB disponível (Atlas ou local)
- Variáveis de ambiente configuradas

## Variáveis de ambiente

Crie um arquivo `.env` com as variáveis abaixo:

```env
MONGO_URI=<sua-string-de-conexao-mongodb>
PORT=3000
CLIENT_URL=https://elitebarber-ruby.vercel.app
NODE_ENV=development
```

Se você usar outra origem de frontend, adicione essa URL em `CLIENT_URL` ou atualize a lista de origens permitidas em `server.js`.

## Instalação

```bash
cd backend
npm install
```

## Executar localmente

```bash
npm run server
```

O servidor iniciará em `http://localhost:3000` (ou na porta definida em `PORT`).

## Mobile e testes em rede local

Para testar no celular com backend local:

1. Rode o backend no computador.
2. Use o IP do computador na rede local, por exemplo `http://192.168.0.10:3000`.
3. No frontend, defina `VITE_API_URL` para esse endereço.
4. No terminal do frontend use `npm run dev -- --host` para expor o servidor Vite na rede.

> Importante: `localhost` no celular aponta para o próprio celular. Use o IP do PC para acessos pela rede.

## Endpoints

- `POST /api/messages/create` — criar nova mensagem.
- `POST /api/schedules` — criar novo agendamento.
- `GET /api/schedules` — listar agendamentos.
- `GET /api/schedules/:id` — obter agendamento por id.
- `PUT /api/schedules/:id` — atualizar agendamento.
- `DELETE /api/schedules/:id` — remover agendamento.

## Observações

- A API usa `express.json()` para receber JSON.
- Caso o frontend retorne erro de CORS no celular, verifique se a origem está permitida.
- Se precisa conectar de um domínio diferente, adicione esse domínio ao `allowedOrigins` em `server.js`.

## Problema comum com MongoDB Atlas (MongooseServerSelectionError)

Se ao iniciar você receber um erro como `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster`, verifique os pontos abaixo:

- Network Access (IP whitelist): no painel do Atlas vá em _Network Access_ → _Add IP Address_ e adicione o IP do servidor onde sua app está rodando. Para deploys em plataformas como Render que usam IPs dinâmicos, você pode adicionar temporariamente `0.0.0.0/0` para permitir todas as origens enquanto testa (não recomendado em produção).
- String de conexão: confirme que `MONGO_URI` tem o formato correto, incluindo o nome do banco, por exemplo:

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster0.ewuyp49.mongodb.net/elitebarber?retryWrites=true&w=majority
```

- Credenciais: verifique usuário e senha do banco e que o usuário tem permissões de leitura/escrita no banco alvo.
- Variáveis de ambiente: defina `MONGO_URI` no painel de Environment da sua plataforma (Render), não apenas no `.env` local.

Se precisar, adicione prints dos logs de conexão (mostramos `err.stack`) para diagnosticar o problema.
