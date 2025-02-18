from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Trabajador,Profesion,Localidad,Provincia, Solicitud
from django.core.exceptions import ObjectDoesNotExist
from .models import Admins,Pedido
from django.contrib.auth.hashers import make_password

class AdminEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admins
        fields = ['email']  # Aquí solo tomamos email y password

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admins
        fields = ['email', 'contrasena']  # Aquí solo tomamos email y password

    def update(self, instance, validated_data):
        """
        Sobreescribimos el método update para encriptar la nueva contraseña.
        """
        password = validated_data.get('password', None)
        if password:
            instance.password = make_password(password)  # Encriptar la contraseña antes de guardarla
        return super().update(instance, validated_data)

class LocalidadDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ['idlocalidad','nombre']

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ['nombre']
class LocalidadSerializer(serializers.ModelSerializer):
    provincia= ProvinciaSerializer()
    class Meta:
        model = Localidad
        fields = ['nombre','provincia']
        def create(self, validated_data):
            provincia_data = validated_data.pop('provincia')
            provincia, created = Provincia.objects.get_or_create(nombre=provincia_data['nombre'])
#Login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            # Buscar el administrador en la tabla Admins
            admin = Admins.objects.get(email=email)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas. Usuario no encontrado.")

        # Comparar la contraseña
        if admin.contrasena != password:
            raise serializers.ValidationError("Credenciales inválidas. Contraseña incorrecta.")

        # Adjuntar el admin validado a los datos validados
        attrs['user'] = admin
        return attrs

#profesion
class ProfesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesion
        fields = ['idprofesion', 'nombre']

#Trabajadores
class TrabajadorDetallesSerializer(serializers.ModelSerializer):
    profesion = serializers.SerializerMethodField()
    localidad = serializers.SerializerMethodField()
    class Meta:
        model = Trabajador
        fields = ['nombre', 'apellido', 'dni', 'email', 'descripcion','talle', 'numtel', 'edad', 'cvlink', 'imagenlink', 'profesion', 'localidad','estadocontrato']
    def get_profesion(self, obj):
        # Accede al nombre de la profesión a través de la clave foránea
        return obj.idprofesion.nombre if obj.idprofesion else "No especificado"
    def get_localidad(self, obj):
        # Accede al nombre de la profesión a través de la clave foránea
        return obj.idlocalidad.nombre if obj.idlocalidad else "No especificado"


class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = ['nombre', 'apellido', 'dni', 'email', 'descripcion', 'numtel', 'edad', 'cvlink', 'imagenlink', 'idprofesion', 'idlocalidad']




class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ['idprovincia', 'nombre']

class LocalidadSerializer(serializers.ModelSerializer):
    provincia = serializers.CharField(write_only=True)  # 'write_only' para el campo de entrada

    class Meta:
        model = Localidad
        fields = ['idlocalidad', 'nombre', 'provincia']

    def create(self, validated_data):
        provincia_nombre = validated_data.pop('provincia')  # Extraemos el nombre de la provincia

        # Buscamos la provincia por nombre
        provincia, created = Provincia.objects.get_or_create(nombre=provincia_nombre)

        # Creamos la localidad y asociamos la provincia
        localidad = Localidad.objects.create(
            nombre=validated_data['nombre'], 
            idprovincia=provincia
        )

        return localidad


class TrabajadorCrearSerializer(serializers.ModelSerializer):
    profesion = serializers.CharField(write_only=True)  # Recibimos el nombre de la profesión
    localidad = LocalidadSerializer()  # Usamos el serializador de localidad

    class Meta:
        model = Trabajador
        fields = ['idtrabajador', 'nombre', 'apellido', 'dni', 'email', 'numtel', 'edad', 'profesion', 'localidad', 'descripcion', 'cvlink', 'imagenlink']

    def create(self, validated_data):
        # Extraemos localidad y profesión de los datos validados
        localidad_data = validated_data.pop('localidad')
        profesion_nombre = validated_data.pop('profesion')  # Obtenemos el nombre de la profesión

        # Buscamos la profesión por nombre
        try:
            profesion = Profesion.objects.get(nombre=profesion_nombre)
        except Profesion.DoesNotExist:
            raise serializers.ValidationError({"profesion": "La profesión no existe."})

        # Crear la localidad
        localidad_serializer = LocalidadSerializer(data=localidad_data)
        if localidad_serializer.is_valid():
            localidad = localidad_serializer.save()
        else:
            raise serializers.ValidationError(localidad_serializer.errors)

        # Crear el trabajador y asociar la profesión y localidad
        trabajador = Trabajador.objects.create(
            **validated_data,
            idlocalidad=localidad,
            idprofesion=profesion  # Asociamos la profesión al trabajador
        )

        return trabajador

class TrabajadorCardSerializer(serializers.ModelSerializer):
    profesion = serializers.CharField(source='idprofesion.nombre', read_only=True)  # Accede al nombre de la profesión
    imagenlink = serializers.ImageField(use_url=True)  # Devuelve la URL completa
    # Añadir un campo para el estado de trabajo que será modificable
    estadotrabajo = serializers.CharField(required=True)

    class Meta:
        model = Trabajador
        fields = ['idtrabajador', 'nombre', 'apellido','dni','edad', 'estadotrabajo', 'profesion','imagenlink',]

class LocalidadListSerializer(serializers.ModelSerializer):
    class Meta:
        model =Localidad
        fields =['idlocalidad','nombre','idprovincia']

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = ['idtrabajador', 'nombre', 'apellido', 'dni', 'email', 'numtel', 'edad', 'idlocalidad', 'idprofesion', 'descripcion', 'cvlink', 'imagenlink']  # Incluye los datos que necesitas

class SolicitudSerializer(serializers.ModelSerializer):
    idtrabajadores = serializers.PrimaryKeyRelatedField(
        queryset=Trabajador.objects.all(), many=True, write_only=True  # Para aceptar IDs en la solicitud
    )
    trabajadores_detalle = TrabajadorSerializer(source='idtrabajadores', many=True, read_only=True)  # Para devolver datos completos

    class Meta:
        model = Solicitud
        fields = ['idsolicitud', 'empresa', 'fecha_inicio', 'fecha_fin', 'idtrabajadores', 'trabajadores_detalle']


class TrabajadoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = [
            'nombre', 'apellido', 'dni', 'email', 'numtel', 'idlocalidad', 
            'idprofesion', 'edad', 'descripcion', 'talle', 'uniforme',
            'estadotrabajo','estadocontrato', 'imagenlink', 'cvlink'
        ]



class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'manga', 'talle']

    