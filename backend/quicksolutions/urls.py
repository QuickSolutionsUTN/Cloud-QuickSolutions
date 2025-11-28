from django.urls import path
from . import views

urlpatterns = [
    
    path('perfiles/', views.PerfilesListCreateView.as_view(), name='perfiles-lista-crear'),
    path('perfiles/<uuid:pk>/', views.PerfilesDetailView.as_view(), name='perfiles-detalle'),
    
    path('categorias/', views.CategoriaListCreateView.as_view(), name='categoria-lista-crear'),
    path('categorias/<int:pk>/', views.CategoriaDetailView.as_view(), name='categoria-detalle'),
    
    
    path('productos/', views.ProductoListCreateView.as_view(), name='producto-lista-crear'),
    path('productos/<int:pk>/', views.ProductoDetailView.as_view(), name='producto-detalle'),
    path('productos/categoria/<int:categoria_id>/', views.ProductoPorCategoriaView.as_view(), name='producto-por-categoria'),

    
    path('solicitud/', views.CrearSolicitudView.as_view(), name='crear-solicitud'),
    path('solicitud/<int:pk>/', views.SolicitudDetailView.as_view(), name='solicitud-detalle'),
    path('solicitud/mis-solicitudes/', views.MisSolicitudesView.as_view(), name='mis-solicitudes'),
    path('solicitud/<int:pk>/cancelar/', views.CancelarSolicitudView.as_view(), name='cancelar-solicitud'),

    path('mantenimiento/', views.TipoMantenimientoListCreateView.as_view(), name='mantenimiento-lista-crear'),
    path('mantenimiento/<int:pk>/', views.TipoMantenimientoDetailView.as_view(), name='mantenimiento-detalle'),

    path('provincias/', views.ProvinciaListView.as_view(), name='provincia-lista'),
    path('localidades/', views.LocalidadListView.as_view(), name='localidad-lista'),
    path('perfiles/<uuid:pk>/domicilio', views.PerfilesDomicilioView.as_view(), name='perfiles-direccion'),

]