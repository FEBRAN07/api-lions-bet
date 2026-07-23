# Lions Bet

Lions Bet is a full-stack betting demo application with a Node.js/Express API, MongoDB persistence, JWT authentication, and a React/Vite frontend. The backend follows a simple MVC-style structure with routes, controllers, services, repositories, models, and middlewares.

## Deploy

Backend: https://api-lions-bet.onrender.com/
Frontend: https://api-lions-bet-frontend.onrender.com/

## Stack

### Backend

- Node.js with ES Modules
- Express 5
- MongoDB with Mongoose
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcryptjs`
- Environment configuration with `dotenv`

### Frontend

- React 19
- Vite 7
- Plain CSS
- Browser `fetch` API
- `localStorage` for session token/user data

## Main Features

- User registration and login
- JWT-protected user profile routes
- Password hashing before persistence
- User wallet balance and deposits
- Public listing of open betting events
- Admin-only event creation, odd updates, and event closing
- User betting on open events
- Wallet debit when a bet is created
- Bet settlement when an event is closed
- Admin-only listing of all bets

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── render.yaml
└── frontend
    ├── src
    ├── public
    ├── package.json
    └── vite.config.js
```

## Requirements

- Node.js
- npm
- MongoDB database URI

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster/database
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGINS=http://localhost:5173
```

Required variables:

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: secret used to sign JWT tokens.

Optional variables:

- `PORT`: API port. Defaults to `3000`.
- `JWT_EXPIRES_IN`: token expiration. Defaults to `1d`.
- `BCRYPT_SALT_ROUNDS`: bcrypt cost factor. Defaults to `10`.
- `CORS_ORIGINS`: comma-separated list of extra allowed frontend origins.

## Running Locally

Install and start the backend:

```bash
cd backend
npm install
npm start
```

Install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

By default, Vite runs the frontend on `http://localhost:5173`. The current frontend source points to the deployed API URL:

```js
const API_BASE_URL = "https://api-lions-bet.onrender.com";
```

Change this constant in `frontend/src/main.jsx` if you want the frontend to call a local backend, for example `http://localhost:3000`.

## Authentication

Protected routes expect a bearer token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

The token is returned by the registration and login endpoints. Admin-only routes also require the authenticated user's `tipo` to be `admin`.

## API Documentation

Base URL for local development:

```text
http://localhost:3000
```

### Health Check

#### `GET /`

Checks whether the API is running.

Response:

```json
{
    "message": "Boilerplate API MVC está rodando."
}
```

### Auth

#### `POST /api/auth/cadastro`

Creates a new user account and returns a JWT.

Body:

```json
{
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "senha": "123456"
}
```

Notes:

- `nome`, `email`, and `senha` are required.
- `senha` must have at least 6 characters.
- New users are created with `tipo: "usuario"` and `saldo: 0`.

#### `POST /api/auth/login`

Authenticates a user and returns a JWT.

Body:

```json
{
    "email": "maria@example.com",
    "senha": "123456"
}
```

### Users

All user routes require authentication.

#### `GET /api/usuarios/perfil`

Returns the authenticated user's profile.

#### `PATCH /api/usuarios/perfil`

Updates the authenticated user's profile.

Body:

```json
{
    "nome": "Maria Souza",
    "senha": "novaSenha123"
}
```

At least one of `nome` or `senha` must be sent.

#### `DELETE /api/usuarios/perfil`

Deletes the authenticated user's account.

#### `GET /api/usuarios/carteira`

Returns the authenticated user's wallet balance.

Response shape:

```json
{
    "carteira": {
        "saldo": 100
    }
}
```

#### `POST /api/usuarios/carteira/deposito`

Deposits money into the authenticated user's wallet.

Body:

```json
{
    "valor": 50
}
```

`valor` must be greater than zero.

#### `GET /api/usuarios`

Admin only. Lists all users.

### Events

#### `GET /api/eventos`

Public route. Lists events with `status: "aberto"`.

#### `GET /api/eventos/:id`

Public route. Returns one open event by ID.

#### `POST /api/eventos`

Admin only. Creates a betting event.

Body:

```json
{
    "mandante": "Lions FC",
    "visitante": "Tigers FC",
    "oddMandante": 1.8,
    "oddEmpate": 3.2,
    "oddVisitante": 2.4
}
```

Odds must be at least `1.01`.

#### `PATCH /api/eventos/:id`

Admin only. Updates the odds of an open event.

Body:

```json
{
    "oddMandante": 1.9,
    "oddEmpate": 3.1,
    "oddVisitante": 2.2
}
```

#### `PATCH /api/eventos/:id/encerrar`

Admin only. Closes an open event and settles pending bets.

Body:

```json
{
    "resultado": "mandante"
}
```

Allowed `resultado` values:

- `mandante`
- `empate`
- `visitante`

Response includes settlement totals:

```json
{
    "totalApostas": 100,
    "ganhadoras": 2,
    "perdedoras": 3,
    "totalPago": 180
}
```

### Bets

All bet routes require authentication.

#### `POST /api/apostas`

Creates a bet for the authenticated user.

Body:

```json
{
    "evento": "64f000000000000000000000",
    "palpite": "mandante",
    "valor": 25
}
```

Allowed `palpite` values:

- `mandante`
- `empate`
- `visitante`

Rules:

- The event must exist and be open.
- `valor` must be greater than zero.
- The user must have enough wallet balance.
- The bet stores the selected odd as `oddNaAposta`.
- The user balance is debited when the bet is created.

#### `GET /api/apostas`

Lists bets created by the authenticated user.

#### `GET /api/apostas/:id`

Returns one bet by ID, only if it belongs to the authenticated user.

#### `GET /api/apostas/admin/todas`

Admin only. Lists all bets.

## Data Models

### User

```json
{
    "nome": "Maria Silva",
    "tipo": "usuario",
    "email": "maria@example.com",
    "saldo": 0
}
```

`tipo` can be `usuario` or `admin`.

### Event

```json
{
    "mandante": "Lions FC",
    "visitante": "Tigers FC",
    "oddMandante": 1.8,
    "oddEmpate": 3.2,
    "oddVisitante": 2.4,
    "status": "aberto",
    "resultado": "mandante"
}
```

`status` can be `aberto` or `encerrado`.

### Bet

```json
{
    "usuario": "64f000000000000000000001",
    "evento": "64f000000000000000000000",
    "palpite": "mandante",
    "valor": 25,
    "oddNaAposta": 1.8,
    "retornoPotencial": 45,
    "status": "pendente"
}
```

`status` can be `pendente`, `ganha`, or `perdida`.

## Deployment

The backend includes a `backend/render.yaml` file configured for Render. It installs dependencies with `npm install`, starts the API with `npm start`, and expects production environment variables such as `MONGO_URI` and `JWT_SECRET`.

The frontend can be built with:

```bash
cd frontend
npm run build
```

And previewed with:

```bash
npm run preview
```
