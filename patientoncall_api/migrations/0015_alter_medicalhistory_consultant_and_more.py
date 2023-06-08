# Generated by Django 4.2.1 on 2023-06-07 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patientoncall_api', '0014_merge_20230607_2246'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicalhistory',
            name='consultant',
            field=models.TextField(blank=True, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='medicalhistory',
            name='visitType',
            field=models.TextField(blank=True, max_length=32, null=True),
        ),
    ]
