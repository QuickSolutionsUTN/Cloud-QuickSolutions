from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly 
from .models import Perfiles, Usuario, Categoria, Producto, TipoServicio, TipoMantenimiento, SolicitudServicio, SolicitudServicioEstado, Provincia, Localidad
from .serializers import (
    PerfilesSerializer, 
    CategoriaSerializer, 
    ProductoSerializer,
    CrearSolicitudSerializer,
    SolicitudServicioSerializer,
#    EnvioSerializer,
    SolicitudDetailSerializer,
    TipoMantenimientoSerializer, 
    ProvinciaSerializer, 
    LocalidadSerializer, 
    DomicilioSerializer
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
    permission_classes = [IsAuthenticatedOrReadOnly]

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductoPorCategoriaView(generics.ListAPIView):
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        categoria_id = self.kwargs['categoria_id']
        return Producto.objects.filter(id_categoria=categoria_id)

##############
class CrearSolicitudView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = CrearSolicitudSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        usuario = request.user

        try:
            producto = Producto.objects.get(id=data['idProducto'])
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
        
        if not estado_inicial:
            return Response({"error": "Estado inicial no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        solicitud = SolicitudServicio.objects.create(
            descripcion=data.get('descripcion', ''),
            id_solicitante=usuario,
            id_tipo_servicio=tipo_servicio,
            id_producto=producto,
            id_tipo_mantenimiento=tipo_mantenimiento,
            id_solicitud_servicio_estado=estado_inicial,
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
    permission_classes = [IsAuthenticated]
    queryset = SolicitudServicio.objects.all()
    serializer_class = SolicitudDetailSerializer  

class TipoMantenimientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ProvinciaListView(generics.ListAPIView):
    queryset = Provincia.objects.all().order_by('nombre')
    serializer_class = ProvinciaSerializer
    permission_classes = [AllowAny]

class LocalidadListView(generics.ListAPIView):
    serializer_class = LocalidadSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        provincia_id = self.request.query_params.get('provincia_id')
        if provincia_id:
            return Localidad.objects.filter(id_provincia=provincia_id).order_by('nombre')
        return Localidad.objects.none()

class PerfilesDomicilioView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DomicilioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.domicilio_set.first()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(None, status=status.HTTP_200_OK)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            nuevo_domicilio = serializer.save(id_usuario=request.user)
            nuevo_domicilio.refresh_from_db()
            respuesta = self.get_serializer(nuevo_domicilio)
            return Response(respuesta.data, status=status.HTTP_201_CREATED)

        else:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            
            domicilio_actualizado = serializer.save()
            
            domicilio_actualizado.refresh_from_db()
            
            respuesta = self.get_serializer(domicilio_actualizado)
            return Response(respuesta.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_204_NO_CONTENT)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
