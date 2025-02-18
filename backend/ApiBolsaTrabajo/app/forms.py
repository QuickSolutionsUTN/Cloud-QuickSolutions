from django import forms
from .models import Trabajador, Profesion, Localidad
class TrabajadorForm(forms.ModelForm):
    profesion_nombre = forms.CharField(max_length=100)
    localidad_nombre = forms.CharField(max_length=100)
    cv = forms.FileField(required=False)
    archivo = forms.ImageField(required=False)

    class Meta:
        model = Trabajador
        fields = ['nombre', 'apellido', 'dni', 'email','numtel','edad','descripcion', 'profesion_nombre', 'localidad_nombre', 'cv', 'archivo']

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Procesar la profesión
        profesion_nombre = self.cleaned_data['profesion_nombre']
        try:
            profesion = Profesion.objects.get(nombre=profesion_nombre)
        except Profesion.DoesNotExist:
            profesion = Profesion.objects.create(nombre=profesion_nombre)

        # Procesar la localidad
        localidad_nombre = self.cleaned_data['localidad_nombre']
        localidad, created = Localidad.objects.get_or_create(nombre=localidad_nombre)

        # Asignar las relaciones de FK
        instance.idprofesion = profesion
        instance.idlocalidad = localidad

        if commit:
            instance.save()
        
        return instance