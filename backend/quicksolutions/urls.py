from django.urls import path
from . import views

urlpatterns = [
    # Cuando alguien visite 'api/categorias/', usará la vista que creamos.
    path('categorias/', views.CategoriaProductoListCreateView.as_view(), name='categoria-lista-crear'),
    #path('solicitudes/', views.SolicitudServicioListCreateView.as_view(), name='solicitud-lista-crear'),
    
    # ... acá pondremos más endpoints después ...
]