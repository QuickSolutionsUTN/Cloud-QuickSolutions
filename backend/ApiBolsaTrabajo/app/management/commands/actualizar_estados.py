from django.core.management.base import BaseCommand
from django.utils.timezone import now
from app.models import Solicitud, Trabajador  

class Command(BaseCommand):
    help = "Actualiza el estado de los trabajadores si la solicitud ha finalizado"

    def handle(self, *args, **kwargs):
        # Obtener la fecha actual
        hoy = now().date()  

        # Buscar solicitudes que ya finalizaron (fecha_fin anterior a hoy)
        solicitudes_vencidas = Solicitud.objects.filter(fecha_fin__lt=hoy)

        if solicitudes_vencidas.exists():
            try:
                # Obtener los trabajadores que participaron en esas solicitudes vencidas
                trabajadores_afectados = Trabajador.objects.filter(
                    idtrabajador__in=Trabajador.objects.filter(solicitudes__in=solicitudes_vencidas)
                    .values_list("idtrabajador", flat=True)
                )

                # Cambiar su estado a "disponible"
                actualizados = trabajadores_afectados.update(estadotrabajo="disponible")

                # Mensaje de éxito en la consola
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✔ {actualizados} trabajadores han sido actualizados a 'Disponible' ({hoy})"
                    )
                )
            except Exception as e:
                # Mensaje de error si algo falla
                self.stdout.write(self.style.ERROR(f"❌ Error al actualizar estados: {e}"))
        else:
            # Mensaje si no hay solicitudes vencidas
            self.stdout.write(self.style.WARNING(f"⚠ No hay solicitudes vencidas ({hoy})"))
