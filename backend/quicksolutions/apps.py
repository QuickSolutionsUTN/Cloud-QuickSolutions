from django.apps import AppConfig


class QuicksolutionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quicksolutions'
    
    def ready(self):
        import quicksolutions.signals  # noqa
