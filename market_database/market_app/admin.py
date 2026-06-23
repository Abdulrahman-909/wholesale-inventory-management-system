from django.contrib import admin
from .models import (
    Category, Product, Customer, Supplier, Buy, BuyItem,
    Sell, SellItem, Stock, Stuff, Job, Warehouse,
    Ledger, LedgerType, LedgerPayment
)

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Supplier)
admin.site.register(Buy)
admin.site.register(BuyItem)
admin.site.register(Sell)
admin.site.register(SellItem)
admin.site.register(Stock)
admin.site.register(Stuff)
admin.site.register(Job)
admin.site.register(Warehouse)
admin.site.register(Ledger)
admin.site.register(LedgerType)
admin.site.register(LedgerPayment)