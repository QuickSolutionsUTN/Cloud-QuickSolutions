from django.db.models.signals import post_save
from django.dispatch import receiver
from .services import publicar_evento_sns

# Reemplazar `Solicitud` por el modelo real que represente una reparación/pedido
from .models import SolicitudServicio

@receiver(post_save, sender=SolicitudServicio)
def solicitud_post_save(sender, instance, created, **kwargs):
    """
    Publica un evento en SNS cuando una solicitud existente cambia (omitimos created).
    Ajustar la lógica para publicar sólo en cambios de 'estado' si hace falta.
    """
    if created:
        return

    datos = {
        "id": instance.id,
        "estado": getattr(instance, "estado", None),
        "usuario_id": getattr(instance, "usuario_id", None),
    }
    try:
        publicar_evento_sns(datos)
    except Exception as e:
        # loguear el error en producción
        print("Error publicando evento SNS desde signal:", e)