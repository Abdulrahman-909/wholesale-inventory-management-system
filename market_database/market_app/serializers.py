from rest_framework import serializers
from django.db.models import Sum
from .models import (
    Category, Product, Customer, Supplier,
    Buy, BuyItem, Sell, SellItem, Stock,
    Stuff, Job, Warehouse, Ledger, LedgerType, LedgerPayment,
    Report, ReportAttachment
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    current_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['product_id', 'name', 'category', 'category_name', 'unit_price', 'image', 'current_stock']

    def get_current_stock(self, obj):
        return obj.get_current_stock()


class BuyItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = BuyItem
        fields = ['product', 'product_name', 'quantity', 'price']


class BuySerializer(serializers.ModelSerializer):
    items = BuyItemSerializer(many=True, read_only=True, source='buyitem_set')
    supplier_name = serializers.ReadOnlyField(source='supplier.name')

    class Meta:
        model = Buy
        fields = ['buy_id', 'supplier', 'supplier_name', 'date', 'items']


class SellItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = SellItem
        fields = ['product', 'product_name', 'quantity', 'price', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantity * obj.price


class SellSerializer(serializers.ModelSerializer):
    items = SellItemSerializer(many=True, read_only=True, source='sellitem_set')
    customer_name = serializers.ReadOnlyField(source='customer.first_name')
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Sell
        fields = ['sell_id', 'customer', 'customer_name', 'date', 'payment_type', 'due_date', 'items', 'total_amount']

    def get_total_amount(self, obj):
        total = sum(item.quantity * item.price for item in obj.sellitem_set.all())
        return total


class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    warehouse_name = serializers.ReadOnlyField(source='warehouse.name')

    class Meta:
        model = Stock
        fields = '__all__'


class StuffSerializer(serializers.ModelSerializer):
    job_name = serializers.ReadOnlyField(source='job.name')

    class Meta:
        model = Stuff
        fields = '__all__'


class LedgerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerType
        fields = '__all__'


class LedgerPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerPayment
        fields = '__all__'


class LedgerSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.first_name', default=None)
    supplier_name = serializers.ReadOnlyField(source='supplier.name', default=None)
    ledger_type_name = serializers.ReadOnlyField(source='ledger_type.name')
    payments = LedgerPaymentSerializer(many=True, read_only=True)
    paid_amount = serializers.SerializerMethodField()

    class Meta:
        model = Ledger
        fields = '__all__'

    def get_paid_amount(self, obj):
        total_paid = obj.payments.aggregate(total=Sum('amount'))['total'] or 0
        return total_paid


class ReportAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ReportAttachment
        fields = ['attachment_id', 'file', 'file_url', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if not obj.file:
            return None
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class ReportSerializer(serializers.ModelSerializer):
    attachments = ReportAttachmentSerializer(many=True, read_only=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    created_by_role = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'report_id',
            'title',
            'description',
            'status',
            'created_by',
            'created_by_username',
            'created_by_role',
            'created_at',
            'updated_at',
            'attachments',
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_created_by_role(self, obj):
        return 'admin' if obj.created_by.is_staff else 'regular'