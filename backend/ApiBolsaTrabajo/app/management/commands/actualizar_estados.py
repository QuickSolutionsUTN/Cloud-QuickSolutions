from django.core.management.base import BaseCommand
from django.utils.timezone import now
from app.models import Solicitud, Trabajador  

class Command(BaseCommand):
    help = "Actualiza el estado de los trabajadores si la solicitud ha finalizado"

    def handle(self, *args, **kwargs):
        hoy = now().date()  
        solicitudes_vencidas = Solicitud.objects.filter(fecha_fin__lt=hoy)

        if solicitudes_vencidas.exists():
            try:
                # Obtener los trabajadores correctamente
                trabajadores_afectados = Trabajador.objects.filter(
                    idtrabajador__in=Trabajador.objects.filter(solicitudes__in=solicitudes_vencidas)
                    .values_list("idtrabajador", flat=True)
                )

                # Actualizar estado de los trabajadores a 'Disponible'
                actualizados = trabajadores_afectados.update(estadotrabajo="disponible")

                self.stdout.write(
                    self.style.SUCCESS(
                        f"✔ {actualizados} trabajadores han sido actualizados a 'Disponible' ({hoy})"
                    )
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error al actualizar estados: {e}"))
        else:
            self.stdout.write(self.style.WARNING(f"⚠ No hay solicitudes vencidas ({hoy})"))
