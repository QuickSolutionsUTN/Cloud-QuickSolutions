from rest_framework import serializers
from .models import Perfiles, Categoria, Producto, SolicitudServicio
    
class PerfilesSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='id.email', read_only=True)
    class Meta:
        model = Perfiles
        fields = '__all__'

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