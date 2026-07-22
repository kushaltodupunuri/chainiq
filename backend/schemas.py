from pydantic import BaseModel, ConfigDict


class ProductIn(BaseModel):
    name: str
    sku: str
    current_stock: int
    reorder_point: int
    lead_time_days: int


class ProductOut(ProductIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str


class OrderIn(BaseModel):
    customer: str
    product: str
    quantity: int


class OrderOut(OrderIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str


class SupplierIn(BaseModel):
    name: str
    email: str
    lead_time_days: int
    reliability_score: int


class SupplierOut(SupplierIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
