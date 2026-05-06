Vending Machine (FastAPI + Next.js)

A tiny full-stack project: FastAPI backend (JWT auth, SQLite) + Next.js frontend (App Router, Axios, Bootstrap).

Create an account, log in, add products, assign them to vending machines, and delete records when needed.

Features

Email/password sign up & JWT login

CRUD:

products (name, description)

machines composed of selected products

Protected pages on the frontend

Swagger/OpenAPI docs at /docs

Ready for Windows (PowerShell) and cross-platform use

Tech Stack

Backend: Python 3.12, FastAPI, SQLAlchemy, Pydantic, Uvicorn, python-jose, passlib (bcrypt), SQLite

Frontend: Next.js 15 (App Router), React, Axios, Bootstrap

Project Structure

vending_machine/

├─ fastapi/

│  ├─ api/

│  │  ├─ main.py

│  │  ├─ database.py

│  │  ├─ models.py

│  │  ├─ deps.py

│  │  └─ routers/

│  │     ├─ auth.py

│  │     ├─ products.py

│  │     └─ machines.py

│  └─ requirements.txt

└─ nextjs/

   ├─ src/app/

   │  ├─ components/ProtectedRoute.js

   │  ├─ context/AuthContext.js

   │  ├─ login/page.js

   │  └─ page.js

   ├─ package.json

   └─ next.config.mjs

Quick Start

Run backend and frontend in two terminals.

1. Backend (FastAPI)

From repository root:

```bash
cd fastapi
```

Create & activate venv on Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate
```

Install deps:

```bash
pip install -r requirements.txt
```

Create a `.env` file, then run the API:

```bash
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

Open docs: http://127.0.0.1:8000/docs

2. Frontend (Next.js)

In a new terminal:

```bash
cd nextjs
npm install
npm run dev
```

Open app: http://localhost:3000

Environment Variables

Create `fastapi/.env`:

```env
AUTH_SECRET_KEY=change_me_to_a_random_long_string
AUTH_ALGORITHM=HS256
```

The frontend is hard-coded to call `http://localhost:8000`.

If you change the backend host/port, update the API URLs in `nextjs/src/app/page.js` and `nextjs/src/app/login/page.js`.

How to Use

Start the API and open `/docs`.

Create User -> `POST /auth/`

Login -> `POST /auth/token` -> copy the `access_token`.

Open the frontend -> `/login` -> sign in.

Create Products, then create Machines by selecting products.

Use Delete buttons to remove products/machines.

API Overview

Auth

`POST /auth/` - create user

`POST /auth/token` - login (OAuth2 password flow), returns JWT

Products (requires `Authorization: Bearer <token>`)

`GET /products/` - list products

`POST /products/` - create product

`DELETE /products/{product_id}` - delete product

Machines (requires `Authorization: Bearer <token>`)

`GET /machines/` - list machines with joined products

`POST /machines/` - create machine with `products: [id, ...]`

`DELETE /machines/{machine_id}` - delete machine

Scripts

Backend:

```bash
uvicorn api.main:app --host 127.0.0.1 --port 8000
```

Frontend:

```bash
npm run dev      # start dev server
npm run build    # production build
npm start        # run production server after build
```

Troubleshooting

401 Unauthorized - include `Authorization: Bearer <token>` header or re-login.

422 Unprocessable Entity - check body shape, for example `products` must be an array of product IDs.

CORS - backend allows `http://localhost:3000` by default.

Port already in use - change ports (`--port` for API, `-p` for Next).

Reset DB - stop API and delete the SQLite file if present; the app will recreate tables.

License

This project is for learning/demo purposes. You may adapt it for your own use.
