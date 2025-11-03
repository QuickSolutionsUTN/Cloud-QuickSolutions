# En tu_app/serializers.py

from rest_framework import serializers
from .models import CategoriaProducto, SolicitudServicio # (Importamos todos los que necesitaremos)
    
class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__' # Incluye 'id' y 'descripcion'


class SolicitudServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudServicio
        fields = '__all__' # Incluye todos los campos del modelo