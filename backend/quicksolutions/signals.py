from django.db.models.signals import post_save
from django.dispatch import receiver
from .services import publicar_evento_sns

from .models import SolicitudServicio


@receiver(post_save, sender=SolicitudServicio)
def notificar_cambios(sender, instance, created, **kwargs):
    """
    Publica un evento en SNS cuando una solicitud existente cambia (omitimos created).
    Ajustar la lógica para publicar sólo en cambios de 'estado' si hace falta.
    """
    if created:
        tipo_evento = "CREATED"
    else:
        tipo_evento = "UPDATED"

    payload = {
        "id": instance.id,
        "estado": getattr(instance, "estado", None),
        "usuario_id": getattr(instance, "usuario_id", None),
        "tipo_evento": tipo_evento,
    }
    try:
        publicar_evento_sns(payload)
    except Exception as e:
        # loguear el error en producción
        print("Error publicando evento SNS desde signal:", e)
