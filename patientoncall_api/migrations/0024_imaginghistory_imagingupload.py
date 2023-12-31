# Generated by Django 4.2.1 on 2023-06-11 18:16

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('patientoncall_api', '0023_alter_medicalhistory_addtomedicalhistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImagingHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateField(blank=True, default=datetime.datetime.today, null=True)),
                ('region', models.CharField(max_length=256)),
                ('indication', models.CharField(max_length=1024)),
                ('report', models.FileField(blank=True, default=True, null=True, upload_to='imagingreports/')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('visitEntry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patientoncall_api.medicalhistory')),
            ],
        ),
        migrations.CreateModel(
            name='ImagingUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(blank=True, default=True, null=True, upload_to='imagingattachments/')),
                ('imagingEntry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patientoncall_api.imaginghistory')),
            ],
        ),
    ]
