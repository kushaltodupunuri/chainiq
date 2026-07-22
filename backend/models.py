from sqlalchemy import Column, Integer, String

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=False, unique=True)
    current_stock = Column(Integer, nullable=False)
    reorder_point = Column(Integer, nullable=False)
    lead_time_days = Column(Integer, nullable=False)
    status = Column(String, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer = Column(String, nullable=False)
    product = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="pending")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    lead_time_days = Column(Integer, nullable=False)
    reliability_score = Column(Integer, nullable=False)
