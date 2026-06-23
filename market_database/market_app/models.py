from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'category'


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, models.DO_NOTHING)
    unit_price = models.DecimalField(max_digits=19, decimal_places=2, default=0)
    # ADDED: Product image support
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    # Alternative: use URL instead of file upload
    # image_url = models.URLField(max_length=500, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'product'

    def get_current_stock(self):
        """Calculate current stock for this product."""
        from django.db.models import Sum
        return Stock.objects.filter(product=self).aggregate(total=Sum('quantity'))['total'] or 0


class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    phone = models.CharField(max_length=45)
    province_id = models.CharField(max_length=45)
    district_id = models.CharField(max_length=45)

    class Meta:
        managed = True
        db_table = 'customer'


class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    province_id = models.CharField(max_length=100)
    email = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'supplier'


class Warehouse(models.Model):
    warehouse_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)
    address = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'warehouse'


class Job(models.Model):
    job_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45)

    class Meta:
        managed = True
        db_table = 'job'


class Stuff(models.Model):
    stuff_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    salary = models.DecimalField(max_digits=19, decimal_places=6)
    address = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    job = models.ForeignKey(Job, models.DO_NOTHING)
    # ADDED: Link to Django User for authentication
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'stuff'


# ==================== TRANSACTION TABLES ====================

class Buy(models.Model):
    buy_id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Supplier, models.DO_NOTHING)
    date = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'buy'


class BuyItem(models.Model):
    product = models.ForeignKey(Product, models.DO_NOTHING)
    buy = models.ForeignKey(Buy, models.DO_NOTHING)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=19, decimal_places=6)

    class Meta:
        managed = True
        db_table = 'buy_item'


class Sell(models.Model):
    sell_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, models.DO_NOTHING)
    date = models.DateField()
    payment_type = models.CharField(max_length=20, default='cash')
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'sell'

    def total_amount(self):
        """Calculate total amount for this sale"""
        return sum(item.quantity * item.price for item in self.sellitem_set.all())


class SellItem(models.Model):
    product = models.ForeignKey(Product, models.DO_NOTHING)
    sell = models.ForeignKey(Sell, models.DO_NOTHING)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=19, decimal_places=6)

    class Meta:
        managed = True
        db_table = 'sell_item'


class Stock(models.Model):
    stock_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, models.DO_NOTHING)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=19, decimal_places=6)
    expire_date = models.DateField()
    warehouse = models.ForeignKey(Warehouse, models.DO_NOTHING)
    reference = models.ForeignKey(Buy, models.DO_NOTHING, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'stock'


# ==================== LEDGER TABLES ====================

class LedgerType(models.Model):
    type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ledger_type'


class Ledger(models.Model):
    ledger_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, models.DO_NOTHING, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, models.DO_NOTHING, null=True, blank=True)
    ledger_type = models.ForeignKey(LedgerType, models.DO_NOTHING)
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    remaining = models.DecimalField(max_digits=19, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')
    reference_sell = models.ForeignKey(Sell, models.DO_NOTHING, null=True, blank=True)
    reference_buy = models.ForeignKey(Buy, models.DO_NOTHING, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'ledger'


class LedgerPayment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    ledger = models.ForeignKey(Ledger, models.DO_NOTHING, related_name='payments')
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, default='cash')
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ledger_payment'


class Report(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_review', 'In Review'),
        ('resolved', 'Resolved'),
    ]

    report_id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    title = models.CharField(max_length=120)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'report'
        ordering = ['-created_at']


class ReportAttachment(models.Model):
    attachment_id = models.AutoField(primary_key=True)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='reports/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'report_attachment'
