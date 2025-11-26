from rest_framework import serializers
from .models import Perfiles, Categoria, Producto, SolicitudServicio, ChecklistMantenimiento, TipoMantenimiento, Domicilio, Provincia, Localidad
    
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
    idCategoria = serializers.PrimaryKeyRelatedField(source='id_categoria', read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'descripcion', 'idCategoria']

class SolicitudServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudServicio
        fields = '__all__' # Incluye todos los campos del modelo

#class EnvioSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Envio
#        fields = ['calle', 'numero', 'piso', 'departamento', 'id_localidad']

class CrearSolicitudSerializer(serializers.Serializer):
    descripcion = serializers.CharField(required=False, allow_blank=True)
    idTipoServicio = serializers.IntegerField()
    idProducto = serializers.IntegerField()
    idTipoMantenimiento = serializers.IntegerField(required=False, allow_null=True)
    conLogistica = serializers.BooleanField()
#    envio = EnvioSerializer(required=False, allow_null=True)

class SolicitudDetailSerializer(serializers.ModelSerializer):
    emailSolicitante = serializers.CharField(source='id_solicitante.email', read_only=True)
    tipoServicio = serializers.CharField(source='id_tipo_servicio.descripcion', read_only=True)
    categoria = serializers.CharField(source='id_producto.id_categoria.descripcion', read_only=True)
    producto = serializers.CharField(source='id_producto.descripcion', read_only=True)
    estado = serializers.CharField(source='id_solicitud_servicio_estado.descripcion', read_only=True)
    fechaGeneracion = serializers.DateTimeField(source='fecha_generacion', read_only=True)
    fechaEstimada = serializers.DateTimeField(source='fecha_estimada', read_only=True)
    fechaFinalizada = serializers.DateTimeField(source='fecha_finalizada', read_only=True)
    diagnosticoTecnico = serializers.CharField(source='diagnostico_tecnico', read_only=True)
    
#    envio = serializers.SerializerMethodField()
    mantenimiento = serializers.SerializerMethodField()

    class Meta:
        model = SolicitudServicio
        fields = [
            'id', 'emailSolicitante', 'tipoServicio', 'categoria', 'producto', 
            'descripcion', 'estado', 'fechaGeneracion', 'monto', 'fechaEstimada', 
            'fechaFinalizada', 'diagnosticoTecnico', 'con_logistica', 'mantenimiento'
        ]

#   def get_envio(self, obj):
#        if hasattr(obj, 'envio'):
#            return {
#                'nroSeguimiento': obj.envio.nro_seguimiento,
#                'calle': obj.envio.calle,
#                'numero': obj.envio.numero,
#                'localidad': obj.envio.id_localidad.nombre
#            }
#        return None

    def get_mantenimiento(self, obj):
        if obj.id_tipo_mantenimiento:
            checklist_items = ChecklistMantenimiento.objects.filter(
                id_tipo_mantenimiento=obj.id_tipo_mantenimiento
            )
            return {
                'checklist': [
                    {'id': item.id, 'descripcion': item.tarea} 
                    for item in checklist_items
                ]
            }
        return None

class TipoMantenimientoSerializer(serializers.ModelSerializer):
    # Renombramos el campo para que coincida con el frontend
    idProducto = serializers.PrimaryKeyRelatedField(source='id_producto', read_only=True)

    class Meta:
        model = TipoMantenimiento
        # Excluimos 'id_producto' original para no enviar duplicados
        fields = ['id', 'nombre', 'descripcion', 'idProducto']
class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ['id', 'nombre']

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ['id', 'nombre', 'id_provincia']

class DomicilioSerializer(serializers.ModelSerializer):
    provincia = serializers.CharField(source='id_localidad.id_provincia.nombre', read_only=True)
    localidad_nombre = serializers.CharField(source='id_localidad.nombre', read_only=True)
    localidad = serializers.PrimaryKeyRelatedField(
        queryset=Localidad.objects.all(),
        source='id_localidad',
        write_only=False
    )
    class Meta:
        model = Domicilio
        fields = ['calle', 'numero', 'departamento', 'codigo_postal', 'localidad','localidad_nombre', 'provincia', 'piso']
