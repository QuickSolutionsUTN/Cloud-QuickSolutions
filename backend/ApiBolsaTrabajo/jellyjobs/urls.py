from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Ruta de administración de Django
    path('admin/', admin.site.urls),

    # Rutas de tu aplicación
    path('app/', include('app.appUrls')),

    # Archivos estáticos
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [

    # Ruta para servir el frontend (debe ir al final)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='home'),
]
