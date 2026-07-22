from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductIn, ProductOut

router = APIRouter()


@router.get("/api/inventory", response_model=list[ProductOut])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.post("/api/inventory", response_model=ProductOut)
def create_product(product: ProductIn, db: Session = Depends(get_db)):
    if product.current_stock <= 0:
        status = "Critical"
    elif product.current_stock <= product.reorder_point:
        status = "Low"
    else:
        status = "In Stock"

    db_product = Product(**product.model_dump(), status=status)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
