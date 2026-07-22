from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import inventory, orders, suppliers
from seed import seed_if_empty

Base.metadata.create_all(bind=engine)
seed_if_empty()

app = FastAPI(title="ChainIQ API")
app.include_router(inventory.router)
app.include_router(orders.router)
app.include_router(suppliers.router)

app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:5173", "http://localhost:5175", "https://chainiq-plum.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ChainIQ API is running"}

@app.get("/api/dashboard/metrics")
def get_metrics():
    return {
        "total_orders_today": 142,
        "inventory_health_pct": 87,
        "supplier_otif_pct": 94,
        "return_rate_pct": 2.1
    }

@app.get("/api/alerts")
def get_alerts():
    return [
        {"id": 1, "severity": "critical", "message": "Organic Oats 1kg will stockout in ~3 days. Reorder takes 5 days."},
        {"id": 2, "severity": "warning", "message": "PO #882 from Agro Fresh delayed by 2 days."},
        {"id": 3, "severity": "warning", "message": "Whole Milk 1L below reorder point — 12 units left."},
        {"id": 4, "severity": "info", "message": "Weekend demand spike predicted — top up Milk stock."},
    ]

@app.get("/api/alerts/summary")
def get_alert_summary():
    return {
        "summary": "Critical: Organic Oats 1kg will stockout in 3 days but reorder takes 5 days — place a rush order with Agro Fresh immediately."
    }