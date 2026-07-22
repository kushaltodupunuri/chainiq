from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Order
from schemas import OrderIn, OrderOut

router = APIRouter()


@router.get("/api/orders", response_model=list[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.post("/api/orders", response_model=OrderOut)
def create_order(order: OrderIn, db: Session = Depends(get_db)):
    db_order = Order(**order.model_dump(), status="pending")
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
