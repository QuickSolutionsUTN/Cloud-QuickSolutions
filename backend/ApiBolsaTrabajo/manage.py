#!/usr/bin/env python
"""
Este script es el punto de entrada para ejecutar comandos administrativos en Django.
- Configura el entorno con la configuración del proyecto ('jellyjobs.settings').
- Llama a 'execute_from_command_line' para ejecutar comandos como 'runserver', 'migrate', etc.
- Si Django no está instalado o el entorno no está configurado correctamente, muestra un error.
"""
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jellyjobs.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
