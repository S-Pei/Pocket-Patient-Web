# Generated by Django 4.2.1 on 2023-06-05 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patientoncall_api', '0008_remove_medicalhistory_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicalhistory',
            name='letter',
            field=models.FileField(blank=True, null=True, upload_to='letterattachments/'),
        ),
    ]
