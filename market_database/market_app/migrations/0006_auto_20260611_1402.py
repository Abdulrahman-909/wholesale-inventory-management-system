from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('market_app', '0005_auto_20260611_1358'),
    ]

    operations = [
        migrations.CreateModel(
            name='LedgerType',
            fields=[
                ('type_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200, blank=True, null=True)),
            ],
            options={
                'db_table': 'ledger_type',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Ledger',
            fields=[
                ('ledger_id', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.DecimalField(max_digits=19, decimal_places=2)),
                ('remaining', models.DecimalField(max_digits=19, decimal_places=2)),
                ('description', models.CharField(max_length=255, blank=True, null=True)),
                ('date', models.DateField(auto_now_add=True)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(max_length=20, default='pending')),
                ('customer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='market_app.customer')),
                ('supplier', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='market_app.supplier')),
                ('ledger_type', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='market_app.ledgertype')),
                ('reference_sell', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='market_app.sell')),
                ('reference_buy', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='market_app.buy')),
            ],
            options={
                'db_table': 'ledger',
                'managed': True,
            },
        ),
    ]