from django.urls import path
from . import views

urlpatterns = [
    
    path('perfiles/', views.PerfilesListCreateView.as_view(), name='perfiles-lista-crear'),
    path('perfiles/<uuid:pk>/', views.PerfilesDetailView.as_view(), name='perfiles-detalle'),
    
    path('categorias/', views.CategoriaListCreateView.as_view(), name='categoria-lista-crear'),
    path('categorias/<int:pk>/', views.CategoriaDetailView.as_view(), name='categoria-detalle'),
    
    path('productos/', views.ProductoListCreateView.as_view(), name='producto-lista-crear'),
    path('productos/<int:pk>/', views.ProductoDetailView.as_view(), name='producto-detalle'),

]