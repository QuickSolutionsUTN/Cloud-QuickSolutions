import os

# Obtiene la ruta del proyecto automáticamente
project_path = os.path.abspath(os.path.dirname(__file__))

# Ruta del script bash dentro del proyecto
script_path = os.path.join(project_path, "cron_script.sh")

# Línea que agregaremos a crontab (usando `$(pwd)` para que funcione en cualquier PC)
cron_job = f"0 0 * * * /bin/bash {script_path} >> {project_path}/cron_log.log 2>&1"

# Verificar si ya existe en crontab
existing_cron = os.popen("crontab -l").read()

if cron_job not in existing_cron:
    new_cron = existing_cron + "\n" + cron_job + "\n"
    os.system(f'(echo "{new_cron}") | crontab -')

print("✅ Tarea programada en crontab con éxito.")
