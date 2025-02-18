import os
from django.apps import AppConfig
from django.core.management import call_command
from django.conf import settings


class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"  # Ajusta al nombre correcto de tu aplicación

    def ready(self):
        """Ejecuta la actualización de estados y programa la tarea al iniciar el servidor."""
        if settings.DEBUG:  # Solo en desarrollo para evitar problemas en producción
            try:
                call_command("actualizar_estados")
                print("✅ Comando actualizar_estados ejecutado correctamente.")
            except Exception as e:
                print(f"⚠ Error al ejecutar actualizar_estados: {e}")

        # Programar la tarea en crontab o en el Programador de tareas de Windows
        self.programar_tarea_cron()

    def programar_tarea_cron(self):
        """Programa la tarea en crontab (Linux) o en el Programador de tareas (Windows)."""
        project_path = os.path.abspath(os.path.dirname(__file__))
        script_path = os.path.join(project_path, "cron_script.sh")

        if not os.path.exists(script_path):
            print(f"❌ Error: No se encontró el archivo {script_path}. Verifica que exista.")
            return

        if os.name == "posix":  # Para Linux/macOS
            cron_job = f"0 0 * * * /bin/bash {script_path} >> {project_path}/cron_log.log 2>&1"
            existing_cron = os.popen("crontab -l").read()

            if cron_job not in existing_cron:
                new_cron = existing_cron + "\n" + cron_job + "\n"
                os.system(f'(echo "{new_cron}") | crontab -')
                print("✅ Tarea programada en crontab con éxito.")
        elif os.name == "nt":  # Para Windows
            task_name = "ActualizarEstadosJellyJobs"
            command = f'schtasks /Create /TN "{task_name}" /TR "python {script_path}" /SC DAILY /ST 00:00 /F'

            # Verificar si la tarea ya existe
            existing_tasks = os.popen(f"schtasks /Query /TN {task_name} 2>&1").read()
            if "ERROR" in existing_tasks:
                os.system(command)
                print(f"✅ Tarea programada en el Programador de Tareas de Windows con éxito ({task_name}).")
            else:
                print(f"⚠ La tarea '{task_name}' ya está programada en el Programador de Tareas de Windows.")
