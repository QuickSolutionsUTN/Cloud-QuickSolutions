# En tu_app/serializers.py

from rest_framework import serializers
from .models import Categoria, Producto, SolicitudServicio# (Importamos todos los que necesitaremos)
    
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__' # Incluye 'id' y 'descripcion'


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class SolicitudServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudServicio
        fields = '__all__' # Incluye todos los campos del modelo


