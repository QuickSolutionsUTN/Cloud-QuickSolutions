from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Perfiles, Categoria, Producto, Provincia, Localidad
from .serializers import PerfilesSerializer, CategoriaSerializer, ProductoSerializer, ProvinciaSerializer, LocalidadSerializer, DomicilioSerializer

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

class PerfilesDomicilioView(generics.RetrieveUpdateAPIView):
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
            serializer.save(id_usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super().update(request, *args, **kwargs)