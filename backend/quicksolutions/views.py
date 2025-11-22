from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Perfiles, Categoria, Producto, Usuario, Producto, TipoServicio, TipoMantenimiento, SolicitudServicio, SolicitudServicioEstado, Envio, Localidad
from .serializers import (
    PerfilesSerializer, 
    CategoriaSerializer, 
    ProductoSerializer,
    CrearSolicitudSerializer,
    SolicitudServicioSerializer,
    EnvioSerializer,
    SolicitudDetailSerializer,
    TipoMantenimientoSerializer  
)

class PerfilesListCreateView(generics.ListCreateAPIView):
    queryset = Perfiles.objects.all()
    serializer_class = PerfilesSerializer

class PerfilesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Perfiles.objects.all()
    serializer_class = PerfilesSerializer


class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductoPorCategoriaView(generics.ListAPIView):
    serializer_class = ProductoSerializer
    
    def get_queryset(self):
        categoria_id = self.kwargs['categoria_id']
        return Producto.objects.filter(id_categoria=categoria_id)

##############
class CrearSolicitudView(APIView):
    def post(self, request):
        serializer = CrearSolicitudSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        usuario = Usuario.objects.filter(email=data['userEmail']).first()
        
        # CORRECCIÓN: Este bloque if debe estar alineado con la variable usuario
        if not usuario:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # CORRECCIÓN: Este try también debe estar alineado al mismo nivel
        try:
            producto = Producto.objects.get(id=data['idTipoProducto'])
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            tipo_servicio = TipoServicio.objects.get(id=data['idTipoServicio'])
        except TipoServicio.DoesNotExist:
            return Response({"error": "Tipo de servicio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        tipo_mantenimiento = None
        if data.get('idTipoMantenimiento'):
            try:
                tipo_mantenimiento = TipoMantenimiento.objects.get(id=data['idTipoMantenimiento'])
            except TipoMantenimiento.DoesNotExist:
                return Response({"error": "Tipo de mantenimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        estado_inicial = SolicitudServicioEstado.objects.first()
        
        solicitud = SolicitudServicio.objects.create(
            descripcion=data.get('descripcion', ''),
            id_solicitante=usuario,
            id_tipo_servicio=tipo_servicio,
            id_producto=producto,
            id_tipo_mantenimiento=tipo_mantenimiento,
            id_solicitud_servicio_estado=estado_inicial,
            tercearizado=False,
            con_logistica=data['conLogistica']
        )
        
        if data['conLogistica'] and data.get('envio'):
            envio_data = data['envio']
            try:
                localidad = Localidad.objects.get(id=envio_data['id_localidad'])
            except Localidad.DoesNotExist:
                solicitud.delete() # Importante: borrar la solicitud si falla el envío
                return Response({"error": "Localidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)
            
            Envio.objects.create(
                id_solicitud_servicio=solicitud,
                calle=envio_data['calle'],
                numero=envio_data['numero'],
                piso=envio_data.get('piso'),
                departamento=envio_data.get('departamento', ''),
                id_localidad=localidad
            )
        
        response_serializer = SolicitudServicioSerializer(solicitud)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class SolicitudDetailView(generics.RetrieveAPIView):
    queryset = SolicitudServicio.objects.all()
    serializer_class = SolicitudServicioSerializer


class SolicitudDetailView(generics.RetrieveAPIView):
    queryset = SolicitudServicio.objects.all()
    serializer_class = SolicitudDetailSerializer  

class TipoMantenimientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer