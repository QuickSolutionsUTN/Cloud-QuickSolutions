from rest_framework import serializers
from .models import Perfiles, Categoria, Producto, SolicitudServicio, Domicilio
    
class PerfilesSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='id.email', read_only=True)
    domicilio = serializers.SerializerMethodField()
    class Meta:
        model = Perfiles
        fields = '__all__'
    def get_domicilio(self, obj):
        usuario = obj.id 
        domicilio_obj = usuario.domicilio_set.first()
        if domicilio_obj:
            return DomicilioSerializer(domicilio_obj).data
        return None

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

class DomicilioSerializer(serializers.ModelSerializer):
    ciudad = serializers.CharField(source='id_localidad.nombre', read_only=True)
    provincia = serializers.CharField(source='id_localidad.id_provincia.nombre', read_only=True)
    class Meta:
        model = Domicilio
        fields = ['calle', 'numero', 'departamento', 'codigo_postal', 'ciudad', 'provincia', 'piso']