from database import SessionLocal
from models import Order, Product, Supplier


def seed_if_empty():
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            db.add_all([
                Product(name="Organic Oats 1kg", sku="OAT001", current_stock=5, reorder_point=20, lead_time_days=5, status="Critical"),
                Product(name="Brown Rice 5kg", sku="RIC002", current_stock=45, reorder_point=15, lead_time_days=4, status="In Stock"),
                Product(name="Whole Milk 1L", sku="MLK003", current_stock=12, reorder_point=30, lead_time_days=2, status="Low"),
                Product(name="Olive Oil 500ml", sku="OIL004", current_stock=60, reorder_point=10, lead_time_days=7, status="In Stock"),
                Product(name="Sourdough Bread", sku="BRD005", current_stock=8, reorder_point=25, lead_time_days=1, status="Critical"),
            ])

        if db.query(Order).count() == 0:
            db.add_all([
                Order(id=4821, customer="Walk-in", product="Organic Oats 1kg", quantity=2, status="delivered"),
                Order(id=4820, customer="Online - Shopify", product="Olive Oil 500ml", quantity=1, status="shipped"),
                Order(id=4819, customer="Walk-in", product="Whole Milk 1L", quantity=3, status="delivered"),
                Order(id=4818, customer="Online - Shopify", product="Brown Rice 5kg", quantity=1, status="packing"),
                Order(id=4817, customer="Wholesale - ABC Co", product="Sourdough Bread", quantity=20, status="shipped"),
            ])

        if db.query(Supplier).count() == 0:
            db.add_all([
                Supplier(name="Agro Fresh", email="orders@agrofresh.com", lead_time_days=5, reliability_score=92),
                Supplier(name="FreshMart Distributors", email="supply@freshmart.com", lead_time_days=3, reliability_score=87),
            ])

        db.commit()
    finally:
        db.close()
