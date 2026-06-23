from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ==================== AUTHENTICATION URLs ====================
    path('api/auth/login/', views.login, name='login'),
    path('api/auth/register/', views.register, name='register'),
    path('api/auth/users/', views.register, name='create_user'),
    path('api/auth/users/list/', views.user_accounts, name='user_accounts'),
    path('api/auth/profile/', views.profile, name='profile'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Backward compatibility for existing frontend calls
    path('api/login/', views.login, name='login_legacy'),
    path('api/register/', views.register, name='register_legacy'),
    path('api/profile/', views.profile, name='profile_legacy'),
    path('api/dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),

    # ==================== CATEGORY URLs ====================
    path('api/categories/', views.category_list, name='category_list'),
    path('api/categories/<int:pk>/', views.category_detail, name='category_detail'),

    # ==================== PRODUCT URLs ====================
    path('api/products/', views.product_list, name='product_list'),
    path('api/products/<int:pk>/', views.product_detail, name='product_detail'),

    # ==================== CUSTOMER URLs ====================
    path('api/customers/', views.customer_list, name='customer_list'),
    path('api/customers/<int:pk>/', views.customer_detail, name='customer_detail'),

    # ==================== SUPPLIER URLs ====================
    path('api/suppliers/', views.supplier_list, name='supplier_list'),
    path('api/suppliers/<int:pk>/', views.supplier_detail, name='supplier_detail'),

    # ==================== SELL (SALES) URLs ====================
    path('api/sales/', views.sell_list, name='sell_list'),
    path('api/sales/<int:pk>/', views.sell_detail, name='sell_detail'),
    path('api/sales/monthly-comparison/', views.sales_monthly_comparison, name='sales_monthly_comparison'),

    # ==================== BUY (PURCHASES) URLs ====================
    path('api/purchases/', views.buy_list, name='buy_list'),
    path('api/purchases/<int:pk>/', views.buy_detail, name='buy_detail'),

    # ==================== STOCK URLs ====================
    path('api/stocks/', views.stock_list, name='stock_list'),
    path('api/stocks/product/<int:product_id>/', views.stock_by_product, name='stock_by_product'),
    path('api/stocks/summary/', views.stock_summary, name='stock_summary'),

    # ==================== WAREHOUSE URLs ====================
    path('api/warehouse/<int:warehouse_id>/stock/', views.warehouse_stock, name='warehouse_stock'),

    # ==================== REPORT URLs ====================
    path('api/reports/daily/', views.daily_sales_report, name='daily_sales_report'),
    path('api/reports/sales/<int:year>/<int:month>/<int:day>/', views.sales_report_by_date, name='sales_report_by_date'),
    path('api/reports/submit/', views.submit_report, name='submit_report'),
    path('api/reports/chat/', views.report_chat_feed, name='report_chat_feed'),
    path('api/reports/my/', views.my_reports, name='my_reports'),
    path('api/reports/inbox/', views.admin_report_inbox, name='admin_report_inbox'),
    path('api/reports/<int:report_id>/status/', views.update_report_status, name='update_report_status'),

    # ==================== LEDGER URLs ====================
    path('api/ledger/', views.ledger_list, name='ledger_list'),
    path('api/ledger/customer/<int:customer_id>/', views.customer_ledger, name='customer_ledger'),
    path('api/ledger/supplier/<int:supplier_id>/', views.supplier_ledger, name='supplier_ledger'),
    path('api/ledger/payment/', views.make_payment, name='make_payment'),
    path('api/ledger/overdue/', views.overdue_ledgers, name='overdue_ledgers'),
    path('api/ledger/summary/', views.ledger_summary, name='ledger_summary'),

    # ==================== STAFF (STUFF) URLs ====================
    path('api/staff/', views.stuff_list, name='stuff_list'),

    # ==================== PUBLIC URL ====================
    path('api/public/', views.public_example, name='public_example'),
]

# Serve media files (product images) in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)