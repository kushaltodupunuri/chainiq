from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ChainIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175"],
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

@app.get("/api/inventory")
def get_inventory():
    return [
        {"id": 1, "name": "Organic Oats 1kg", "sku": "OAT001", "current_stock": 5, "reorder_point": 20, "status": "Critical"},
        {"id": 2, "name": "Brown Rice 5kg", "sku": "RIC002", "current_stock": 45, "reorder_point": 15, "status": "In Stock"},
        {"id": 3, "name": "Whole Milk 1L", "sku": "MLK003", "current_stock": 12, "reorder_point": 30, "status": "Low"},
        {"id": 4, "name": "Olive Oil 500ml", "sku": "OIL004", "current_stock": 60, "reorder_point": 10, "status": "In Stock"},
        {"id": 5, "name": "Sourdough Bread", "sku": "BRD005", "current_stock": 8, "reorder_point": 25, "status": "Critical"},
    ]

@app.get("/api/orders")
def get_orders():
    return [
        {"id": 4821, "customer": "Walk-in", "product": "Organic Oats 1kg", "quantity": 2, "status": "delivered"},
        {"id": 4820, "customer": "Online - Shopify", "product": "Olive Oil 500ml", "quantity": 1, "status": "shipped"},
        {"id": 4819, "customer": "Walk-in", "product": "Whole Milk 1L", "quantity": 3, "status": "delivered"},
        {"id": 4818, "customer": "Online - Shopify", "product": "Brown Rice 5kg", "quantity": 1, "status": "packing"},
        {"id": 4817, "customer": "Wholesale - ABC Co", "product": "Sourdough Bread", "quantity": 20, "status": "shipped"},
    ]

@app.get("/api/suppliers")
def get_suppliers():
    return [
        {"id": 1, "name": "Agro Fresh", "email": "orders@agrofresh.com", "lead_time_days": 5, "reliability_score": 92},
        {"id": 2, "name": "FreshMart Distributors", "email": "supply@freshmart.com", "lead_time_days": 3, "reliability_score": 87},
    ]

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