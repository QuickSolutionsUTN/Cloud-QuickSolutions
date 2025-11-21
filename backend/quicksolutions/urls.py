from django.urls import path
from . import views

urlpatterns = [
    # Cuando alguien visite 'api/categorias/', usará la vista que creamos.
    path('categorias/', views.CategoriaListCreateView.as_view(), name='categoria-lista-crear'),
    #path('solicitudes/', views.SolicitudServicioListCreateView.as_view(), name='solicitud-lista-crear'),
    
    path('productos/', views.ProductoListCreateView.as_view(), name='producto-lista-crear'),

]