from django.db.models.signals import post_save
from django.dispatch import receiver
from .services import publicar_evento_sns
from .models import SolicitudServicio
from django.conf import settings

@receiver(post_save, sender=SolicitudServicio)
def notificar_cambios(sender, instance, created, **kwargs):
    """
    Publica un evento en SNS cuando una solicitud es creada o actualizada.
    Ajustar la lógica para publicar sólo en cambios de 'estado' si hace falta.
    """
    if not settings.ENABLE_NOTIFICATIONS:
        print("🔕 Notificaciones desactivadas en .env")
        return

    cliente = instance.id_solicitante
    cliente_email = getattr(cliente, "email", None)
    nombre_cliente = getattr(cliente, "first_name", "Desconocido")

    if instance.id_tipo_mantenimiento:
        titulo_trabajo = f"Mantenimiento - {instance.id_tipo_mantenimiento.descripcion}"
    else:
        titulo_trabajo = f"Servicio - {instance.id_tipo_servicio.descripcion}"

    estado_texto = (
        str(instance.id_solicitud_servicio_estado.descripcion)
        if instance.id_solicitud_servicio_estado
        else "Desconocido"
    )
    
    es_mantenimiento = True if instance.id_tipo_mantenimiento else False

    payload = {
        "id_reparacion": instance.id,
        "tipo_evento": "CREATED" if created else "UPDATED",
        "cliente_email": cliente_email,
        "cliente_nombre": nombre_cliente,
        "estado": estado_texto,
        "producto": str(instance.id_producto),  
        "titulo_trabajo": titulo_trabajo,  
        "fecha_estimada": str(instance.fecha_estimada)
        if instance.fecha_estimada
        else "A confirmar",
        "con_logistica": instance.con_logistica,
        "problema_reportado": instance.descripcion,         
        "diagnostico_tecnico": instance.diagnostico_tecnico,
        "resumen_final": instance.resumen,
        "es_mantenimiento": es_mantenimiento,
    }
    
    try:
        publicar_evento_sns(payload)
    except Exception as e:
        # loguear el error en producción
        print("Error publicando evento SNS desde signal:", e)