from django.contrib import admin
from .models import Admins,Localidad, Profesion, Provincia, Trabajador, Solicitud, Trabajadorxprofesion, Valoracion
from django.utils.safestring import mark_safe

@admin.register(Admins)
class AdminsAdmin(admin.ModelAdmin):
    list_display = ('idadmin', 'email')
    search_fields = ('email',)

@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    list_display = ('idprovincia', 'nombre',)
    search_fields = ('nombre',)
    
@admin.register(Localidad)
class LocalidadAdmin(admin.ModelAdmin):
    list_display = ('idlocalidad', 'nombre', 'idprovincia',)
    search_fields = ('nombre',)
    list_filter = ('idprovincia',)

@admin.register(Profesion)
class ProfesionAdmin(admin.ModelAdmin):
    list_display = ('idprofesion', 'nombre')
    search_fields = ('nombre',)

@admin.register(Trabajador)
class TrabajadorAdmin(admin.ModelAdmin):
    list_display = ('idtrabajador', 'nombre', 'apellido', 'dni', 'email', 'estadotrabajo', 'estadocontrato', 'idprofesion', 'idlocalidad','ver_imagen', 'ver_cv')
    search_fields = ('nombre', 'apellido', 'dni', 'email')
    list_filter = ('estadotrabajo', 'estadocontrato', 'idlocalidad', 'idprofesion')
    list_display_links = ('ver_imagen', 'ver_cv')  # Hace que los campos de imagen y CV sean clicables
    
    def ver_imagen(self, obj):
        if obj.imagenlink:
            return mark_safe(f'<img src="{obj.imagenlink.url}" width="100px" height="auto" />')
        return 'No disponible'
    ver_imagen.short_description = 'Imagen'

    def ver_cv(self, obj):
        if obj.cvlink:
            return mark_safe(f'<a href="{obj.cvlink.url}" target="_blank">Ver CV</a>')
        return 'No disponible'
    ver_cv.short_description = 'CV'

@admin.register(Solicitud)
class SolicitudAdmin(admin.ModelAdmin):
    list_display = ('idsolicitud', 'empresa', 'fecha_inicio', 'fecha_fin')
    filter_horizontal = ('idtrabajadores',)  # para mejorar la interfaz de selección de trabajadores
    search_fields = ('empresa',)
    list_filter = ('fecha_inicio', 'fecha_fin')

@admin.register(Trabajadorxprofesion)
class TrabajadorxProfesionAdmin(admin.ModelAdmin):
    list_display = ('idtrabajador', 'idprofesion')
    search_fields = ('idtrabajador__nombre', 'idprofesion__nombre')

@admin.register(Valoracion)
class ValoracionAdmin(admin.ModelAdmin):
    list_display = ('idvaloracion', 'estrellas', 'opinion', 'idtrabajador')
    search_fields = ('opinion',)
    list_filter = ('estrellas',)

