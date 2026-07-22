from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Order
from schemas import OrderIn, OrderOut, OrderUpdate

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


@router.put("/api/orders/{order_id}", response_model=OrderOut)
def update_order(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    for field, value in order.model_dump().items():
        setattr(db_order, field, value)

    db.commit()
    db.refresh(db_order)
    return db_order


@router.delete("/api/orders/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(db_order)
    db.commit()
