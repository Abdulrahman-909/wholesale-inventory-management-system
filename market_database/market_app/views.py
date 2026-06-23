from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.db.models import Sum, F, Q, DecimalField
from django.db.models.functions import TruncMonth
from datetime import datetime, date, timedelta
from decimal import Decimal, InvalidOperation
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from .permissions import is_admin_user
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError


def get_user_role(user):
    return 'admin' if is_admin_user(user) else 'regular'


def forbid_non_admin_write(request):
    if request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] and not is_admin_user(request.user):
        return Response(
            {'error': 'Only admin users can modify data.'},
            status=status.HTTP_403_FORBIDDEN
        )
    return None


# ==================== CATEGORY APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        categories = Category.objects.all()# category.object.get(product.id=1)   explain this part
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():  # it checks if the data is valid or not. it checks if the mandatory field is filled, the data is correct
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])# explain why we do not user parser
def category_detail(request, pk): # the pk is for the that every pk must save in its own url
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    try:
        category = Category.objects.get(category_id=pk)   #  (category_id=999)  if the try except do not exist explain what happen
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser]) # we used this part so that our backend could accept every form of data image word another thing. why we explicit use these passer
def product_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET': # explain page that how many product in one page
        # ADD pagination
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))

        products = Product.objects.all()

        # Pagination
        paginator = Paginator(products, page_size)
        page_obj = paginator.get_page(page)
        serializer = ProductSerializer(page_obj, many=True)

        return Response({
            'data': serializer.data,
            'total': paginator.count,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages
        })
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic(): # it is a field where if one part of database storing goes wrong everything will roll back
                product = serializer.save()
                initial_quantity = int(request.data.get('initial_quantity', 0) or 0)# explain to it that It's for time wwe have already some amount
                initial_price = request.data.get('initial_price', product.unit_price)# where we have some price like in warehouse 450 in store 500

                if initial_quantity > 0:
                    warehouse = Warehouse.objects.first()# it chose the first warehouse  main warehouse
                    if warehouse is None:
                        warehouse = Warehouse.objects.create(name='Main Warehouse', address='Default')# this line if there is no warehouse it builds one
                    Stock.objects.create(
                        product=product,
                        quantity=initial_quantity,
                        price=initial_price,
                        expire_date=date.today() + timedelta(days=3650),
                        warehouse=warehouse,
                    )
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    try:
        product = Product.objects.get(product_id=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== CUSTOMER APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def customer_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def customer_detail(request, pk):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    try:
        customer = Customer.objects.get(customer_id=pk)
    except Customer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== SUPPLIER APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def supplier_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def supplier_detail(request, pk):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    try:
        supplier = Supplier.objects.get(supplier_id=pk)
    except Supplier.DoesNotExist:
        return Response({'error': 'Supplier not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SupplierSerializer(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== SELL APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sell_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        sells = Sell.objects.all().order_by('-date') # explain you used dash for desecrating order
        serializer = SellSerializer(sells, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        with transaction.atomic():
            items_data = request.data.get('items', []) # explain  this part is for the item that has been soled and the brackets are that if that sale is not done it's okay
            payment_type = request.data.get('payment_type', 'cash')# this part tells us what kind of payment will be done if the kind of payment didn't enter the default is cash
            due_date = request.data.get('due_date', None)# id it is a loan then the time for the return of the money will be specified

            if not items_data:
                return Response({'error': 'No items in sale'}, status=status.HTTP_400_BAD_REQUEST) # check if the item is there

            total_amount = 0
            for item in items_data:# this loop is that iterate in bill and find the quantity of item time the price 
                quantity = item.get('quantity')
                price = item.get('price')
                total_amount += quantity * price# explain why we don't have the total amount from frontend

                product_id = item.get('product')
                try:# this part search product in model if their it will return otherwise the except part
                    product = Product.objects.get(product_id=product_id)
                    total_stock = Stock.objects.filter(product=product).aggregate(total=Sum('quantity'))['total'] or 0# checks if there is amount in stock ot not if not return zero
                    if total_stock < quantity:# quantity is what customer wants
                        return Response({# we use filter because it might be from one product in different stock
                            'error': f'Not enough stock for {product.name}. Available: {total_stock}, Requested: {quantity}'
                        }, status=status.HTTP_400_BAD_REQUEST)
                except Product.DoesNotExist:
                    return Response({'error': f'Product {product_id} not found'}, status=status.HTTP_400_BAD_REQUEST)

            sell_data = {
                'customer': request.data.get('customer'),
                'date': request.data.get('date', datetime.now().date()),
                'payment_type': payment_type,
                'due_date': due_date if payment_type == 'credit' else None
            }
            serializer = SellSerializer(data=sell_data)

            if serializer.is_valid():
                sell = serializer.save()

                for item in items_data:
                    product = Product.objects.get(product_id=item.get('product'))
                    quantity = item.get('quantity')
                    price = item.get('price')

                    SellItem.objects.create(
                        sell=sell,
                        product=product,
                        quantity=quantity,
                        price=price
                    )

                    remaining_to_deduct = quantity
                    stock_records = Stock.objects.filter(product=product).order_by('expire_date')# the FIFO

                    for stock_record in stock_records:# this loop dose the FIFO logic
                        if remaining_to_deduct <= 0:
                            break
                        if stock_record.quantity <= remaining_to_deduct:
                            remaining_to_deduct -= stock_record.quantity
                            stock_record.delete()
                        else:
                            stock_record.quantity -= remaining_to_deduct# it goes to another stock
                            stock_record.save()
                            remaining_to_deduct = 0

                if payment_type == 'credit':
                    ledger_type, created = LedgerType.objects.get_or_create(
                        name='Customer Credit',
                        defaults={'description': 'Customer bought on credit'}
                    )
                    ledger = Ledger.objects.create(
                        customer=sell.customer,
                        ledger_type=ledger_type,
                        amount=total_amount,
                        remaining=total_amount,
                        description=f'Sale #{sell.sell_id} - Credit sale',
                        due_date=due_date or date.today() + timedelta(days=30),
                        reference_sell=sell,
                        status='pending'
                    )

                result_serializer = SellSerializer(sell)
                return Response(result_serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sell_detail(request, pk):
    try:
        sell = Sell.objects.get(sell_id=pk)
    except Sell.DoesNotExist:
        return Response({'error': 'Sell not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = SellSerializer(sell)
    return Response(serializer.data)


# ==================== BUY APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def buy_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        buys = Buy.objects.all().order_by('-date')
        serializer = BuySerializer(buys, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        with transaction.atomic():
            items_data = request.data.get('items', [])
            payment_type = request.data.get('payment_type', 'cash')
            due_date = request.data.get('due_date', None)

            if not items_data:
                return Response({'error': 'No items in purchase'}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = 0
            for item in items_data:
                total_amount += item.get('quantity') * item.get('price')

            buy_data = {
                'supplier': request.data.get('supplier'),
                'date': request.data.get('date', datetime.now().date())
            }
            serializer = BuySerializer(data=buy_data)

            if serializer.is_valid():
                buy = serializer.save()

                for item in items_data:
                    product_id = item.get('product')
                    quantity = item.get('quantity')
                    price = item.get('price')
                    warehouse_id = item.get('warehouse', 1)
                    expire_date = item.get('expire_date', '2026-12-31')

                    BuyItem.objects.create(
                        buy=buy,
                        product_id=product_id,
                        quantity=quantity,
                        price=price
                    )

                    Stock.objects.create(
                        product_id=product_id,
                        quantity=quantity,
                        price=price,
                        expire_date=expire_date,
                        warehouse_id=warehouse_id,
                        reference=buy
                    )

                if payment_type == 'credit':
                    ledger_type, created = LedgerType.objects.get_or_create(
                        name='Supplier Debit',
                        defaults={'description': 'Purchase on credit from supplier'}
                    )
                    ledger = Ledger.objects.create(
                        supplier=buy.supplier,
                        ledger_type=ledger_type,
                        amount=-total_amount,
                        remaining=-total_amount,
                        description=f'Purchase #{buy.buy_id} - Credit purchase',
                        due_date=due_date or date.today() + timedelta(days=30),
                        reference_buy=buy,
                        status='pending'
                    )

                result_serializer = BuySerializer(buy)
                return Response(result_serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buy_detail(request, pk):
    try:
        buy = Buy.objects.get(buy_id=pk)
    except Buy.DoesNotExist:
        return Response({'error': 'Buy not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = BuySerializer(buy)
    return Response(serializer.data)


# ==================== STOCK APIs ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_list(request):
    stocks = Stock.objects.values('product__product_id', 'product__name', 'warehouse__name').annotate(
        total_quantity=Sum('quantity'),
        average_price=Sum(F('price') * F('quantity')) / Sum('quantity')
    )
    return Response(stocks)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_by_product(request, product_id):
    stocks = Stock.objects.filter(product_id=product_id)
    serializer = StockSerializer(stocks, many=True)
    total_quantity = stocks.aggregate(total=Sum('quantity'))['total'] or 0
    return Response({
        'product_id': product_id,
        'total_quantity': total_quantity,
        'batches': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_summary(request):
    total_products = Product.objects.count()
    total_stock_value = Stock.objects.aggregate(total=Sum(F('quantity') * F('price')))['total'] or 0

    low_stock = []
    for product in Product.objects.all():
        stock = product.get_current_stock()
        if stock < 10:
            low_stock.append({
                'product_id': product.product_id,
                'name': product.name,
                'stock': stock
            })

    return Response({
        'total_products': total_products,
        'total_stock_value': total_stock_value,
        'low_stock_items': low_stock
    })


# ==================== WAREHOUSE APIs ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def warehouse_stock(request, warehouse_id):
    stocks = Stock.objects.filter(warehouse_id=warehouse_id)
    serializer = StockSerializer(stocks, many=True)
    return Response(serializer.data)


# ==================== REPORT APIs ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_sales_report(request):
    today = datetime.now().date()
    sales = Sell.objects.filter(date=today)#SELECT * FROM sell WHERE date='2026-06-13';


    serializer = SellSerializer(sales, many=True)

    total_amount = 0
    for sale in sales:
        for item in sale.sellitem_set.all():
            total_amount += item.quantity * item.price

    return Response({
        'date': today,
        'total_sales': sales.count(),
        'total_amount': total_amount,
        'sales': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_report_by_date(request, year, month, day):
    date_obj = datetime(year, month, day).date()
    sales = Sell.objects.filter(date=date_obj)
    serializer = SellSerializer(sales, many=True)

    total_amount = 0
    for sale in sales:
        for item in sale.sellitem_set.all():
            total_amount += item.quantity * item.price

    return Response({
        'date': date_obj,
        'total_sales': sales.count(),
        'total_amount': total_amount,
        'sales': serializer.data
    })


# ==================== LEDGER APIs ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ledger_list(request):
    ledgers = Ledger.objects.all().order_by('-date')
    serializer = LedgerSerializer(ledgers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_ledger(request, customer_id):
    ledgers = Ledger.objects.filter(customer_id=customer_id).order_by('-date')
    serializer = LedgerSerializer(ledgers, many=True)

    total_credit = ledgers.filter(amount__gt=0).aggregate(total=Sum('remaining'))['total'] or 0
    total_debit = ledgers.filter(amount__lt=0).aggregate(total=Sum('remaining'))['total'] or 0

    return Response({
        'customer_id': customer_id,
        'total_credit_remaining': total_credit,
        'total_debit_remaining': abs(total_debit),
        'net_balance': total_credit + total_debit,
        'transactions': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def supplier_ledger(request, supplier_id):
    ledgers = Ledger.objects.filter(supplier_id=supplier_id).order_by('-date')
    serializer = LedgerSerializer(ledgers, many=True)

    total_credit = ledgers.filter(amount__gt=0).aggregate(total=Sum('remaining'))['total'] or 0
    total_debit = ledgers.filter(amount__lt=0).aggregate(total=Sum('remaining'))['total'] or 0

    return Response({
        'supplier_id': supplier_id,
        'total_credit_remaining': total_credit,
        'total_debit_remaining': abs(total_debit),
        'net_balance': total_credit + total_debit,
        'transactions': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Only admin users can post payments.'}, status=status.HTTP_403_FORBIDDEN)

    ledger_id = request.data.get('ledger_id')
    raw_amount = request.data.get('amount')
    payment_method = request.data.get('payment_method', 'cash')
    reference_number = request.data.get('reference_number', '')

    try:
        amount = Decimal(str(raw_amount))
    except (InvalidOperation, TypeError):# the payment type id not correct
        return Response({'error': 'Payment amount must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

    if amount <= 0:
        return Response({'error': 'Payment amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        ledger = Ledger.objects.get(ledger_id=ledger_id)
    except Ledger.DoesNotExist:
        return Response({'error': 'Ledger not found'}, status=status.HTTP_404_NOT_FOUND)

    if amount > abs(ledger.remaining):# if the payment is grater than the loan 1500>1000
        return Response({
            'error': f'Payment amount exceeds remaining balance. Remaining: {abs(ledger.remaining)}'
        }, status=status.HTTP_400_BAD_REQUEST)

    payment = LedgerPayment.objects.create(# the history will be safe
        ledger=ledger,
        amount=amount,
        payment_method=payment_method,
        reference_number=reference_number
    )

    if ledger.remaining < 0:# shows that the system does not owe anything
        ledger.remaining += amount
    else:
        ledger.remaining -= amount

    if ledger.remaining == 0:
        ledger.status = 'paid'
    elif abs(ledger.remaining) < abs(ledger.amount):
        ledger.status = 'partial'

    ledger.save()

    return Response({
        'message': 'Payment recorded successfully',
        'payment_id': payment.payment_id,
        'remaining_balance': ledger.remaining,
        'status': ledger.status
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def overdue_ledgers(request):
    today = date.today()
    overdue = Ledger.objects.filter(
        due_date__lt=today,
        remaining__gt=0,
        status__in=['pending', 'partial']
    )
    serializer = LedgerSerializer(overdue, many=True)

    return Response({
        'count': overdue.count(),
        'total_overdue_amount': overdue.aggregate(total=Sum('remaining'))['total'] or 0,
        'overdue_items': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ledger_summary(request):
    customer_credit = Ledger.objects.filter(
        customer__isnull=False,
        amount__gt=0
    ).aggregate(total=Sum('remaining'))['total'] or 0

    supplier_debit = Ledger.objects.filter(
        supplier__isnull=False,
        amount__lt=0
    ).aggregate(total=Sum('remaining'))['total'] or 0

    return Response({
        'total_customers_owe_you': customer_credit,
        'total_you_owe_suppliers': abs(supplier_debit),
        'net_position': customer_credit + supplier_debit,
        'overdue_count': Ledger.objects.filter(
            due_date__lt=date.today(),
            remaining__gt=0
        ).count()
    })


# ==================== STUFF APIs ====================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def stuff_list(request):
    forbidden = forbid_non_admin_write(request)
    if forbidden:
        return forbidden

    if request.method == 'GET':
        stuff = Stuff.objects.all()
        serializer = StuffSerializer(stuff, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = StuffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== PUBLIC EXAMPLE ====================
@api_view(['GET'])
@permission_classes([AllowAny])# this used for testing for the connectivity between the front and back
def public_example(request):
    return Response({'message': 'This is public'})


# ==================== AUTHENTICATION APIS ====================

@api_view(['POST'])
@permission_classes([AllowAny])# we use allow cuz every one can enter the login part
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'role': get_user_role(user),
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Only admin can create users.'}, status=status.HTTP_403_FORBIDDEN)

    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    email = (request.data.get('email') or '').strip()
    role = request.data.get('role', 'regular')

    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if not password or len(password) < 8:
        return Response({'error': 'Password must be at least 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

    is_staff = role == 'admin'

    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            is_staff=is_staff,
            is_superuser=is_staff
        )
    except IntegrityError:
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'message': 'User created successfully',
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': get_user_role(user),
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': get_user_role(user),
        'is_admin': is_admin_user(user),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_accounts(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all().order_by('username')
    data = [# we didn't use serializer cuz here is only four filed
        {
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': 'admin' if u.is_staff else 'regular',
        }
        for u in users
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    from datetime import date
    today = date.today()
    today_sales = Sell.objects.filter(date=today)
    today_revenue = sum(s.total_amount() for s in today_sales)

    return Response({
        'today_sales_count': today_sales.count(),
        'today_revenue': today_revenue,
        'total_products': Product.objects.count(),
        'total_customers': Customer.objects.count(),
        'low_stock_count': sum(1 for p in Product.objects.all() if p.get_current_stock() < 10),
        'is_admin': is_admin_user(request.user),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_monthly_comparison(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    today = date.today()
    current_month_start = today.replace(day=1)
    previous_month_end = current_month_start - timedelta(days=1)# today is like 13 so it start from 1st of the month
    previous_month_start = previous_month_end.replace(day=1)#from the previous month the 31 data

    current = SellItem.objects.filter(
        sell__date__gte=current_month_start,
        sell__date__lte=today
    ).aggregate(total=Sum(F('quantity') * F('price'), output_field=DecimalField(max_digits=20, decimal_places=2)))['total'] or 0
     # this part by using the F multiply the price and quantity
    previous = SellItem.objects.filter(
        sell__date__gte=previous_month_start,
        sell__date__lte=previous_month_end
    ).aggregate(total=Sum(F('quantity') * F('price'), output_field=DecimalField(max_digits=20, decimal_places=2)))['total'] or 0

    monthly_breakdown = (
        SellItem.objects
        .annotate(month=TruncMonth('sell__date'))
        .values('month')
        .annotate(total=Sum(F('quantity') * F('price'), output_field=DecimalField(max_digits=20, decimal_places=2)))
        .order_by('month')
    )

    chart_points = [# this part is ready for frontend and the front received it by Chart.js Recharts

        {
            'month': row['month'].strftime('%Y-%m') if row['month'] else '',
            'total': row['total'] or 0,
        }
        for row in monthly_breakdown
    ]

    return Response({
        'current_month_total': current,
        'last_month_total': previous,
        'chart_points': chart_points,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def submit_report(request):
    title = request.data.get('title', '').strip()
    description = request.data.get('description', '').strip()# for deleting spaces from both sides
    files = request.FILES.getlist('files')

    if not description:
        return Response({'error': 'Description is required'}, status=status.HTTP_400_BAD_REQUEST)

    report = Report.objects.create(
        created_by=request.user,
        title=title or f"Message from {request.user.username}",
        description=description,
    )

    for f in files:
        ReportAttachment.objects.create(report=report, file=f)

    return Response(
        ReportSerializer(report, context={'request': request}).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reports(request):
    reports = Report.objects.filter(created_by=request.user).prefetch_related('attachments')
    serializer = ReportSerializer(reports, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_chat_feed(request):
    reports = Report.objects.all().prefetch_related('attachments')
    serializer = ReportSerializer(reports, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_report_inbox(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    reports = Report.objects.all().prefetch_related('attachments')# we use it to return only the file with the related files
    serializer = ReportSerializer(reports, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_report_status(request, report_id):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    try:
        report = Report.objects.get(report_id=report_id)
    except Report.DoesNotExist:
        return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    allowed = {'open', 'in_review', 'resolved'}
    if new_status not in allowed:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    report.status = new_status
    report.save(update_fields=['status', 'updated_at'])
    return Response(ReportSerializer(report, context={'request': request}).data)
