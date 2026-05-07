Vending Machine Management

A small full-stack vending machine management app built with FastAPI, SQLite, JWT authentication, and Next.js.

Users can register, log in, create products, manage warehouse inventory, assign products to vending machines, restock products, sell items from machines, and put machine stock back into the warehouse.

Features

- Username/password registration and JWT login
- Protected frontend pages
- Product management with name, description, price, and warehouse quantity
- Machine management with products assigned to each machine
- Warehouse inventory tracking
- Restock products into the warehouse
- Add product quantity from warehouse to a machine
- Sell product quantity from a machine
- Put product quantity back from a machine to the warehouse
- Delete machines while returning all machine stock to the warehouse
- Swagger/OpenAPI docs at `/docs`

Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn, python-jose, passlib, SQLite
- Frontend: Next.js, React, Axios, Bootstrap

Project Structure

```text
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
```

Quick Start

Run the backend and frontend in two separate terminals.

Backend

```bash
cd fastapi
source ../vending_machine_venv/bin/activate
uvicorn api.main:app --reload
```

Open API docs:

```text
http://localhost:8000/docs
```

Frontend

```bash
cd nextjs
npm install
npm run dev
```

Open the app:

```text
http://localhost:3000
```

Environment Variables

Create `fastapi/.env`:

```env
AUTH_SECRET_KEY=change_me_to_a_random_long_string
AUTH_ALGORITHM=HS256
```

The frontend currently calls the backend at `http://localhost:8000`.

Inventory Logic

- `Warehouse` means product quantity stored outside machines.
- `In machines` means the total quantity currently loaded into vending machines.
- `Total quantity` means warehouse quantity plus machine quantity.
- `Restock` adds quantity to the warehouse.
- `Add Quantity` moves quantity from the warehouse into a machine.
- `Sell` removes quantity from a machine and decreases total inventory.
- `Put Back` moves quantity from a machine back into the warehouse.
- `Put Back All` returns all quantity for that product from a machine to the warehouse.
- Deleting a machine returns all products in that machine to the warehouse before deleting it.

API Overview

Auth

- `POST /auth/` - create user
- `POST /auth/token` - login and return JWT

Products

- `GET /products/` - list products with warehouse and machine quantities
- `POST /products/` - create product
- `POST /products/{product_id}/restock` - add quantity to warehouse
- `PUT /products/{product_id}/price` - update product price
- `DELETE /products/{product_id}` - delete product

Machines

- `GET /machines/` - list machines with assigned products
- `POST /machines/` - create machine
- `POST /machines/{machine_id}/products/{product_id}` - add product quantity to machine
- `POST /machines/{machine_id}/products/{product_id}/delete-quantity` - sell quantity from machine
- `POST /machines/{machine_id}/products/{product_id}/put-back` - return quantity to warehouse
- `DELETE /machines/{machine_id}/products/{product_id}` - return all quantity to warehouse and remove product from machine
- `DELETE /machines/{machine_id}` - delete machine and return all machine stock to warehouse

Useful Commands

Backend:

```bash
uvicorn api.main:app --reload
```

Frontend:

```bash
npm run dev
npm run build
npm start
```

Troubleshooting

- `Address already in use`: another backend server is already running on port 8000.
- `401 Unauthorized`: log in again so the frontend has a valid JWT token.
- `422 Unprocessable Entity`: check the request body shape and required fields.
- Login stays on the login page: make sure the FastAPI backend is running.
- Reset local data: stop the backend and delete the local SQLite database file. The app will recreate tables on startup.

License

This project is for learning and demo purposes.
