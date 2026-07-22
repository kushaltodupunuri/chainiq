from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Supplier
from schemas import SupplierIn, SupplierOut

router = APIRouter()


@router.get("/api/suppliers", response_model=list[SupplierOut])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()


@router.post("/api/suppliers", response_model=SupplierOut)
def create_supplier(supplier: SupplierIn, db: Session = Depends(get_db)):
    db_supplier = Supplier(**supplier.model_dump())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier
