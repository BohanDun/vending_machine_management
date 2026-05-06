from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

machine_product_association = Table(
    'machine_products', Base.metadata,
    Column('machine_id', Integer, ForeignKey('machines.id')),
    Column('product_id', Integer, ForeignKey('products.id')),
    Column('quantity', Integer, nullable=False, default=0),
)

class User(Base):
    __tablename__ = 'users'
    id  = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Product(Base):
    __tablename__ = 'products'
    id  = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index = True)
    quantity = Column(Integer, nullable=False, default=0)
    price = Column(Numeric(10, 2), nullable=False, default=0)
    machines = relationship('Machine', secondary=machine_product_association, back_populates='products')

class Machine(Base):
    __tablename__ = 'machines'
    id  = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index = True)
    products = relationship('Product', secondary=machine_product_association, back_populates='machines')
