from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, products, machines

from .database import Base, engine, ensure_machine_product_columns, ensure_product_columns

app = FastAPI()

Base.metadata.create_all(bind=engine)
ensure_product_columns()
ensure_machine_product_columns()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def health_check():
    return "Health check complete"

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(machines.router)
