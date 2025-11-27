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
    class Meta:
        model = Producto
        fields = ['id', 'descripcion', 'id_categoria']

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


class ChecklistMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistMantenimiento
        fields = ['id', 'tarea', 'obligatorio']

class TipoMantenimientoSerializer(serializers.ModelSerializer):
    checklist = ChecklistMantenimientoSerializer(many=True, required=False, allow_null=True, source='checklistmantenimiento_set')

    class Meta:
        model = TipoMantenimiento
        fields = ['id', 'nombre', 'descripcion', 'checklist']
    
    def create(self, validated_data):
        checklist_data = validated_data.pop('checklistmantenimiento_set', [])
        tipo_mantenimiento = TipoMantenimiento.objects.create(**validated_data)
        for item_data in checklist_data:
            ChecklistMantenimiento.objects.create(id_tipo_mantenimiento=tipo_mantenimiento, **item_data)
            
        return tipo_mantenimiento

    def update(self, instance, validated_data):
        checklist_data = validated_data.pop('checklistmantenimiento_set', None)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.save()
        if checklist_data is not None:
            incoming_ids = set([item.get('id') for item in checklist_data if item.get('id')])
            existing_items_ids = set(instance.checklistmantenimiento_set.values_list('id', flat=True))
            items_to_delete = existing_items_ids - incoming_ids
            instance.checklistmantenimiento_set.filter(id__in=items_to_delete).delete()
            for item_data in checklist_data:
                item_id = item_data.get('id')
                
                if item_id:
                    try:
                        checklist_item = ChecklistMantenimiento.objects.get(id=item_id, id_tipo_mantenimiento=instance)
                        checklist_item.tarea = item_data.get('tarea', checklist_item.tarea)
                        checklist_item.obligatorio = item_data.get('obligatorio', checklist_item.obligatorio)
                        checklist_item.save()
                    except ChecklistMantenimiento.DoesNotExist:
                        pass 
                else:
                    ChecklistMantenimiento.objects.create(id_tipo_mantenimiento=instance, **item_data)
        return instance


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
