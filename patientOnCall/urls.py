from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('main/', views.displayInfo, name='patient-info'),
    path('prescription/', views.displayPrescription, name='patient-prescription')
    # path('api/getpatient', views.getPatient, name='apiGetPatient')
]