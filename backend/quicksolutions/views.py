from rest_framework.views import APIView
from django.shortcuts import render
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly 
from .models import Perfiles, Categoria, Producto, TipoServicio, TipoMantenimiento, SolicitudServicio, SolicitudServicioEstado, Provincia, Localidad
from .serializers import (
    PerfilesSerializer, 
    CategoriaSerializer, 
    ProductoSerializer,
    CrearSolicitudSerializer,
    SolicitudServicioSerializer,
    SolicitudListAdminSerializer,
#    EnvioSerializer,
    SolicitudDetailSerializer,
    SolicitudServicioEstadoSerializer,
    TipoMantenimientoSerializer, 
    ProvinciaSerializer, 
    LocalidadSerializer, 
    DomicilioSerializer,
    PresupuestarSolicitudSerializer,
    FinalizarSolicitudSerializer,
)

class PerfilesListCreateView(generics.ListCreateAPIView):
    queryset = Perfiles.objects.select_related('id').prefetch_related('id__domicilio_set__id_localidad__id_provincia')
    serializer_class = PerfilesSerializer

class PerfilesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Perfiles.objects.select_related('id').prefetch_related('id__domicilio_set__id_localidad__id_provincia')
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
    
    def get(self, request):
        """Lista todas las solicitudes (para admin dashboard)"""
        solicitudes = SolicitudServicio.objects.select_related(
            'id_solicitante',
            'id_tipo_servicio',
            'id_producto',
            'id_producto__id_categoria',
            'id_solicitud_servicio_estado'
        ).order_by('-fecha_generacion')
        serializer = SolicitudListAdminSerializer(solicitudes, many=True)
        return Response(serializer.data)
    
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
        
        # if data['conLogistica'] and data.get('envio'):
        #     envio_data = data['envio']
        #     try:
        #         localidad = Localidad.objects.get(id=envio_data['id_localidad'])
        #     except Localidad.DoesNotExist:
        #         solicitud.delete() # Importante: borrar la solicitud si falla el envío
        #         return Response({"error": "Localidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        #     
        #     Envio.objects.create(
        #         id_solicitud_servicio=solicitud,
        #         calle=envio_data['calle'],
        #         numero=envio_data['numero'],
        #         piso=envio_data.get('piso'),
        #         departamento=envio_data.get('departamento', ''),
        #         id_localidad=localidad
        #     )
        
        response_serializer = SolicitudServicioSerializer(solicitud)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class SolicitudDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SolicitudServicio.objects.select_related(
        'id_solicitante',
        'id_tipo_servicio',
        'id_producto',
        'id_producto__id_categoria',
        'id_solicitud_servicio_estado',
        'id_tipo_mantenimiento'
    ).prefetch_related(
        'id_tipo_mantenimiento__checklistmantenimiento_set'
    )
    serializer_class = SolicitudDetailSerializer  


class MisSolicitudesView(generics.ListAPIView):
    """Obtiene todas las solicitudes del usuario autenticado"""
    permission_classes = [IsAuthenticated]
    serializer_class = SolicitudDetailSerializer

    def get_queryset(self):
        return SolicitudServicio.objects.select_related(
            'id_solicitante',
            'id_tipo_servicio',
            'id_producto',
            'id_producto__id_categoria',
            'id_solicitud_servicio_estado',
            'id_tipo_mantenimiento'
        ).filter(
            id_solicitante=self.request.user
        ).order_by('-fecha_generacion')

class solicitudesAdminListView(generics.ListAPIView):
    """Obtiene todas las solicitudes (para admin)"""
    permission_classes = [IsAuthenticated]
    serializer_class = SolicitudDetailSerializer

    def get_queryset(self):
        return SolicitudServicio.objects.select_related(
            'id_solicitante',
            'id_tipo_servicio',
            'id_producto',
            'id_producto__id_categoria',
            'id_solicitud_servicio_estado'
        ).order_by('-fecha_generacion')

class CancelarSolicitudView(APIView):
    """Permite al usuario o administrador cancelar una solicitud"""
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            solicitud = SolicitudServicio.objects.get(pk=pk)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        # Determinar si el usuario que hace la petición es admin
        try:
            perfil_usuario = Perfiles.objects.get(id=request.user)
            is_admin = (perfil_usuario.rol == 'admin')
        except Perfiles.DoesNotExist:
            is_admin = False

        if solicitud.id_solicitante != request.user and not is_admin:
            return Response({"error": "No tienes permiso para cancelar esta solicitud"}, status=status.HTTP_403_FORBIDDEN)
        
        # Verificar que la solicitud esté en estado que permita cancelación
        estado_actual = solicitud.id_solicitud_servicio_estado.descripcion.lower()
        if estado_actual not in ['iniciada', 'presupuestada']:
            return Response(
                {"error": f"No se puede cancelar una solicitud en estado '{estado_actual}'"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Buscar el estado "Cancelada"
        try:
            estado_cancelada = SolicitudServicioEstado.objects.get(descripcion__iexact='Cancelada')
        except SolicitudServicioEstado.DoesNotExist:
            return Response({"error": "Estado 'Cancelada' no encontrado en el sistema"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # Guardar motivo (si viene) en el campo resumen y marcar fecha_cancelada
        motivo = request.data.get('resumen') or request.data.get('motivo') or ''
        solicitud.id_solicitud_servicio_estado = estado_cancelada
        solicitud.resumen = motivo
        solicitud.fecha_cancelada = timezone.now()
        solicitud.save(update_fields=['id_solicitud_servicio_estado', 'resumen', 'fecha_cancelada'])
        
        serializer = SolicitudDetailSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IniciarSolicitudView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            solicitud = SolicitudServicio.objects.get(pk=pk)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        if solicitud.fecha_iniciada is None:
            solicitud.fecha_iniciada = timezone.now()
            solicitud.save(update_fields=['fecha_iniciada'])
        
        serializer = SolicitudDetailSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PresupuestarSolicitudView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            solicitud = SolicitudServicio.objects.get(pk=pk)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PresupuestarSolicitudSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            estado_presupuestada = SolicitudServicioEstado.objects.get(descripcion__iexact='Presupuestada')
        except SolicitudServicioEstado.DoesNotExist:
            return Response({"error": "Estado 'Presupuestada' no encontrado en el sistema"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        now = timezone.now()
        solicitud.diagnostico_tecnico = data.get('diagnosticoTecnico')
        solicitud.monto = data.get('monto')
        solicitud.fecha_estimada = data.get('fechaEstimada')
        solicitud.id_solicitud_servicio_estado = estado_presupuestada
        solicitud.fecha_revisada = now 
        solicitud.fecha_presupuestada = now
        
        solicitud.save()
        
        response_serializer = SolicitudDetailSerializer(solicitud)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class FinalizarSolicitudView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            solicitud = SolicitudServicio.objects.get(pk=pk)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FinalizarSolicitudSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data

        try:
            estado_finalizada = SolicitudServicioEstado.objects.get(descripcion__iexact='Finalizada')
        except SolicitudServicioEstado.DoesNotExist:
            return Response({"error": "Estado 'Finalizada' no encontrado en el sistema"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        now = timezone.now()
        solicitud.resumen = data.get('resumen')
        solicitud.fecha_finalizada = now
        solicitud.id_solicitud_servicio_estado = estado_finalizada
        
        solicitud.save()
        
        response_serializer = SolicitudDetailSerializer(solicitud)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class AdminChangeStateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        solicitud_id = request.data.get('id')
        estado_id = request.data.get('idSolicitudServicioEstado')

        if not solicitud_id or not estado_id:
            return Response({"error": "Faltan 'id' o 'idSolicitudServicioEstado' en el cuerpo"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            solicitud = SolicitudServicio.objects.get(pk=solicitud_id)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        try:
            nuevo_estado = SolicitudServicioEstado.objects.get(pk=estado_id)
        except SolicitudServicioEstado.DoesNotExist:
            return Response({"error": "Estado de solicitud no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        solicitud.id_solicitud_servicio_estado = nuevo_estado
        solicitud.save()

        serializer = SolicitudDetailSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserChangeStateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        accion = request.data.get('accion')

        if accion not in ['aprobar', 'rechazar']:
            return Response(
                {"error": "La acción debe ser 'aprobar' o 'rechazar'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            solicitud = SolicitudServicio.objects.get(pk=pk)
        except SolicitudServicio.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        # Verificar que el usuario autenticado es el dueño de la solicitud
        if solicitud.id_solicitante_id != request.user.id:
            return Response(
                {"error": "No tienes permiso para modificar esta solicitud"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verificar que la solicitud está en estado "Presupuestada"
        if solicitud.id_solicitud_servicio_estado.descripcion.lower() != 'presupuestada':
            return Response(
                {"error": "La solicitud no está en estado 'Presupuestada'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()

        if accion == 'aprobar':
            try:
                estado_aprobada = SolicitudServicioEstado.objects.get(descripcion__iexact='Aprobada')
            except SolicitudServicioEstado.DoesNotExist:
                return Response(
                    {"error": "Estado 'Aprobada' no encontrado en el sistema"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            solicitud.fecha_aprobada = now
            solicitud.id_solicitud_servicio_estado = estado_aprobada

        else:  # rechazar
            try:
                estado_cancelada = SolicitudServicioEstado.objects.get(descripcion__iexact='Cancelada')
            except SolicitudServicioEstado.DoesNotExist:
                return Response(
                    {"error": "Estado 'Cancelada' no encontrado en el sistema"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            solicitud.fecha_cancelada = now
            solicitud.id_solicitud_servicio_estado = estado_cancelada

        solicitud.save()

        serializer = SolicitudDetailSerializer(solicitud)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TipoMantenimientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TipoMantenimientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class SolicitudEstadoDetailView(generics.RetrieveAPIView):
    """Devuelve detalle de un estado de solicitud por id"""
    queryset = SolicitudServicioEstado.objects.all()
    serializer_class = SolicitudServicioEstadoSerializer
    permission_classes = [IsAuthenticated]


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


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verificar que el usuario sea admin
        try:
            perfil = Perfiles.objects.get(id=request.user)
            if perfil.rol != 'admin':
                return Response(
                    {"error": "No tienes permisos para acceder a esta información"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        except Perfiles.DoesNotExist:
            return Response(
                {"error": "Perfil no encontrado"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Query optimizada para solicitudes con todas las relaciones necesarias
            solicitudes = SolicitudServicio.objects.select_related(
                'id_solicitante',
                'id_tipo_servicio',
                'id_producto',
                'id_producto__id_categoria',
                'id_solicitud_servicio_estado'
            ).values(
                'id',
                'monto',
                'con_logistica',
                'fecha_generacion',
                'fecha_aprobada',
                'fecha_finalizada',
                'fecha_presupuestada',
                'fecha_cancelada',
                'id_solicitante__email',
                'id_tipo_servicio__descripcion',
                'id_producto__descripcion',
                'id_producto__id_categoria__descripcion',
                'id_solicitud_servicio_estado__descripcion',
            ).order_by('-fecha_generacion')
            
            # Formatear solicitudes para el frontend
            solicitudes_data = [
                {
                    'id': s['id'],
                    'emailSolicitante': s['id_solicitante__email'],
                    'tipoServicio': s['id_tipo_servicio__descripcion'],
                    'categoria': s['id_producto__id_categoria__descripcion'],
                    'producto': s['id_producto__descripcion'],
                    'estado': s['id_solicitud_servicio_estado__descripcion'],
                    'fechaGeneracion': s['fecha_generacion'],
                    'monto': s['monto'],
                    'fechaAprobada': s['fecha_aprobada'],
                    'fechaFinalizada': s['fecha_finalizada'],
                    'fechaPresupuestada': s['fecha_presupuestada'],
                    'fechaCancelada': s['fecha_cancelada'],
                    'conLogistica': s['con_logistica'],
                }
                for s in solicitudes
            ]
            
            # Conteos simples (1 query cada uno)
            usuarios_count = Perfiles.objects.count() 
            productos_count = Producto.objects.count()
            mantenimientos_count = TipoMantenimiento.objects.count()
            
            return Response({
                'solicitudes': solicitudes_data,
                'usuariosCount': usuarios_count,
                'productosCount': productos_count,
                'mantenimientosCount': mantenimientos_count,
            })
        
        except Exception as e:
            return Response(
                {"error": f"Error al obtener estadísticas del dashboard: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
