from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
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