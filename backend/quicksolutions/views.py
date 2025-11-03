from django.shortcuts import render
from rest_framework import generics
from .models import CategoriaProducto
from .serializers import CategoriaProductoSerializer

# Esta vista genérica de DRF maneja GET (listar) y POST (crear) por nosotros.
class CategoriaProductoListCreateView(generics.ListCreateAPIView):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer