from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product
from schemas import ProductIn, ProductOut

router = APIRouter()


def _status_for(current_stock: int, reorder_point: int) -> str:
    if current_stock <= 0:
        return "Critical"
    if current_stock <= reorder_point:
        return "Low"
    return "In Stock"


@router.get("/api/inventory", response_model=list[ProductOut])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.post("/api/inventory", response_model=ProductOut)
def create_product(product: ProductIn, db: Session = Depends(get_db)):
    status = _status_for(product.current_stock, product.reorder_point)
    db_product = Product(**product.model_dump(), status=status)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/api/inventory/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product: ProductIn, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in product.model_dump().items():
        setattr(db_product, field, value)
    db_product.status = _status_for(product.current_stock, product.reorder_point)

    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/api/inventory/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
