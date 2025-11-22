import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.urls import reverse
from quicksolutions import urls as quicksolutions_urls

print("=== URLs en quicksolutions ===")
for pattern in quicksolutions_urls.urlpatterns:
    print(pattern)

print("\n=== Probando reverse('crear-solicitud') ===")
try:
    url = reverse('crear-solicitud')
    print(f"✅ URL encontrada: {url}")
except Exception as e:
    print(f"❌ ERROR: {e}")