from rest_framework import serializers

from .models import (
    PatientUser,
    MedicalHistory,
    LabHistory,
    Medication,
    ImagingHistory,
    ImagingUpload,
    Diary
)

class PatientUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientUser
        fields = ['patientBirthdate', 'patientAddress']

class MedicalHistorySerializer(serializers.ModelSerializer):
    letter = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    class Meta:
        model = MedicalHistory
        fields = ['id', 'admissionDate', 'dischargeDate', 'consultant', 
                  'summary', 'visitType', 'letter', 'addToMedicalHistory']

class LabHistorySerializer(serializers.ModelSerializer):
    report = serializers.ImageField(max_length=None, use_url=True, 
                                        allow_null=False, required=True)
    class Meta:
        model = LabHistory
        fields = ('date', 'report')

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ('id', 'drug', 'dosage', 'startDate', 'endDate', 'duration', 'route', 'status', 'comments', 'byPatient')

class ImagingHistorySerializer(serializers.ModelSerializer):
    report = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    class Meta:
        model = ImagingHistory
        fields = ['id','patient','date','scanType','region','indication','report']

class ImagingUploadSerializer(serializers.ModelSerializer):
    image = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    class Meta:
        model = ImagingUpload
        fields = ['imagingEntry','image']

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ('id', 'date', 'content', 'readByDoctor')
