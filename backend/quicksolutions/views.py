from django.shortcuts import render
from rest_framework import generics
from .models import Perfiles, Categoria, Producto
from .serializers import PerfilesSerializer, CategoriaSerializer, ProductoSerializer

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