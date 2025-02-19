from django.urls import path
from app.views import AdminLoginView, CrearTrabajadorPendienteAPIView, ActualizarEstadoContratoView,ProfesionAPIView,TrabajadorDetailView,TrabajadorCardView,OptionView,LocalidadListView, SolicitudAPIView, InteraccionAPIView, eliminar_solicitud,VerifyTokenView,RecuperarContrasenaView,CambiarEmailView,CambiarContrasenaView,CountPendingWorkers,CountValidSolicitudes,ModificarTrabajadorView, NotificacionesView,PedidoCreateAPIView,TrabajadorSinUniformeAPIView, UpdatePostIDAPIView
from django.conf import settings
from .utils import validar_token_view
from django.conf.urls.static import static

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('crear-trabajador/', CrearTrabajadorPendienteAPIView.as_view(), name='crear-trabajador'),
    path('cambiar-contrasena/',CambiarContrasenaView.as_view(),name='cambiar-contrasena'),
    path('cambiar-email/',CambiarEmailView.as_view(),name='cambiar-email'),
    path('validarToken/',VerifyTokenView.as_view(),name='validarToken/'),
    path('actualizar-estado/<int:pk>/', ActualizarEstadoContratoView.as_view(), name='actualizar-estado'),
    path('profesionlista/', ProfesionAPIView.as_view(),name='profesionlista'),
    path('trabajador/<int:pk>/', TrabajadorDetailView.as_view(), name='trabajador-detail'),
    path('trabajador-card/', TrabajadorCardView.as_view(),name='trabajador-card'),
    path('get-trabajadores/', OptionView.as_view(), name='get-trabajadores'),
    path('update-trabajador/<int:idtrabajador>/', OptionView.as_view(),name='update-trabajador'),
    path('localidad/',LocalidadListView.as_view(),name='localidad'),
    path('solicitudes/', SolicitudAPIView.as_view(), name='listar_solicitudes'),  # 🔹 SOLO ADMIN
    path('interaccion/', InteraccionAPIView.as_view(), name='interaccion'),  # 🔹 INTERACCIÓN EXTERNA
    path("solicitudes/<int:idsolicitud>/", eliminar_solicitud, name="eliminar_solicitud"),
    path("validate-token/", validar_token_view, name="validate-token"),
    path("recuperar-contrasena/", RecuperarContrasenaView.as_view(), name="recuperar_contrasena"),
    path("trabajadores-pendientes-num/",CountPendingWorkers.as_view(),name="trabajadores-pendientes-num"),
    path("solicitudes-pendientes-num/",CountValidSolicitudes.as_view(),name="solicitudes-pendientes-num"),
    path("trabajadores/<int:dni>/", ModificarTrabajadorView.as_view(), name="modificar_trabajador"),
    path('notificaciones/', NotificacionesView.as_view(), name='notificaciones'),
    path('pedidos/', PedidoCreateAPIView.as_view(), name='pedidos'),
    path('trabajadores-sin-uniforme/', TrabajadorSinUniformeAPIView.as_view(), name='trabajadores-sin-uniforme'),
    path('trabajadores/<int:pk>/update-postid/', UpdatePostIDAPIView.as_view(), name='update-postid'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
