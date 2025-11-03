from django.db import models
from django.conf import settings

# --- Modelos Base (No dependen de otros) ---

class Provincia(models.Model):
    nombre = models.CharField(max_length=50)

    class Meta:
        db_table = 'provincia' 

    def __str__(self):
        return self.nombre


class CategoriaProducto(models.Model):
    descripcion = models.CharField(max_length=50)

    class Meta:
        db_table = 'categoria_producto'

    def __str__(self):
        return self.descripcion


class EmpresaExterna(models.Model):
    nombre = models.CharField(max_length=50)
    cuil = models.BigIntegerField()
    telefono = models.IntegerField(blank=True, null=True)
    email = models.CharField(max_length=50)

    # Django puede manejar la tabla de unión por vos
    # si definís la relación ManyToMany explícitamente.
    categorias = models.ManyToManyField(
        CategoriaProducto,
        through='EmpresaCategoria' # Usamos la tabla de unión que creaste
    )

    class Meta:
        db_table = 'empresa_externa'

    def __str__(self):
        return self.nombre


class TipoServicio(models.Model):
    descripcion = models.CharField(max_length=50)

    class Meta:
        db_table = 'tipo_servicio'

    def __str__(self):
        return self.descripcion


class SolicitudServicioEstado(models.Model):
    descripcion = models.CharField(max_length=50)

    class Meta:
        db_table = 'solicitud_servicio_estado'

    def __str__(self):
        return self.descripcion

# --- Modelos Dependientes (Nivel 1) ---

class Localidad(models.Model):
    nombre = models.CharField(max_length=50)
    id_provincia = models.ForeignKey(
        Provincia, 
        models.PROTECT,  # Equivalente a ON DELETE RESTRICT
        db_column='id_provincia'
    )

    class Meta:
        db_table = 'localidad'

    def __str__(self):
        return f"{self.nombre}, {self.id_provincia.nombre}"


class TipoProducto(models.Model):
    descripcion = models.CharField(max_length=50)
    id_categoria_producto = models.ForeignKey(
        CategoriaProducto, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_categoria_producto'
    )

    class Meta:
        db_table = 'tipo_producto'

    def __str__(self):
        return f"{self.descripcion} (Cat: {self.id_categoria_producto.descripcion})"


class EmpresaCategoria(models.Model):
    id_empresa = models.ForeignKey(
        EmpresaExterna, 
        models.CASCADE, # ON DELETE CASCADE
        db_column='id_empresa'
    )
    id_categoria = models.ForeignKey(
        CategoriaProducto, 
        models.CASCADE, # ON DELETE CASCADE
        db_column='id_categoria'
    )

    class Meta:
        db_table = 'empresa_categoria'


class Perfiles(models.Model):
    
    class RoleChoices(models.TextChoices):
        CLIENTE = 'cliente'
        EMPLEADO = 'empleado'
        ADMIN = 'admin'

    id = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='id'
    )
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    fecha_de_nacimiento = models.DateField(blank=True, null=True)
    rol = models.CharField(
        max_length=50,
        choices=RoleChoices.choices,
        default=RoleChoices.CLIENTE
    )

    class Meta:
        db_table = 'perfiles'

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.rol})"

# --- Modelos Dependientes (Nivel 2) ---

class Domicilio(models.Model):
    calle = models.CharField(max_length=50)
    numero = models.IntegerField()
    departamento = models.CharField(max_length=50, blank=True, null=True)
    id_localidad = models.ForeignKey(
        Localidad, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_localidad'
    )
    codigo_postal = models.CharField(max_length=50)
    pais = models.CharField(max_length=50)
    
    id_usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.CASCADE, # ON DELETE CASCADE
        db_column='id_usuario'
    )

    class Meta:
        db_table = 'domicilio'

    def __str__(self):
        return f"{self.calle} {self.numero}, {self.id_localidad.nombre}"


class TipoMantenimiento(models.Model):
    id_tipo_producto = models.ForeignKey(
        TipoProducto, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_tipo_producto'
    )
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=250)

    class Meta:
        db_table = 'tipo_mantenimiento'

    def __str__(self):
        return self.nombre

# --- Modelos Dependientes (Nivel 3) ---

class ChecklistMantenimiento(models.Model):
    id_tipo_mantenimiento = models.ForeignKey(
        TipoMantenimiento, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_tipo_mantenimiento'
    )
    tarea = models.CharField(max_length=150)
    obligatorio = models.BooleanField()

    class Meta:
        db_table = 'checklist_mantenimiento'


class SolicitudServicio(models.Model):
    descripcion = models.TextField(blank=True, null=True)
    
    id_solicitante = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_solicitante',
        related_name='solicitudes_creadas' # Ayuda a Django a diferenciar las FKs
    )
    
    id_tipo_servicio = models.ForeignKey(
        TipoServicio, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_tipo_servicio'
    )
    id_tipo_producto = models.ForeignKey(
        TipoProducto, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_tipo_producto'
    )
    id_tipo_mantenimiento = models.ForeignKey(
        TipoMantenimiento, 
        models.SET_NULL, # ON DELETE SET NULL
        db_column='id_tipo_mantenimiento', 
        blank=True, 
        null=True
    )
    fecha_generacion = models.DateTimeField(auto_now_add=True) # auto_now_add usa el DEFAULT now()
    id_solicitud_servicio_estado = models.ForeignKey(
        SolicitudServicioEstado, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_solicitud_servicio_estado'
    )
    
    id_tecnico_asignado = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.SET_NULL, # ON DELETE SET NULL
        db_column='id_tecnico_asignado',
        related_name='solicitudes_asignadas', # Ayuda a Django
        blank=True, 
        null=True
    )
    
    fecha_estimada = models.DateTimeField(blank=True, null=True)
    monto = models.FloatField(blank=True, null=True)
    tercearizado = models.BooleanField()
    con_logistica = models.BooleanField()
    fecha_iniciada = models.DateTimeField(blank=True, null=True)
    fecha_revisada = models.DateTimeField(blank=True, null=True)
    fecha_presupuestada = models.DateTimeField(blank=True, null=True)
    diagnostico_tecnico = models.TextField(blank=True, null=True)
    fecha_aprobada = models.DateTimeField(blank=True, null=True)
    fecha_finalizada = models.DateTimeField(blank=True, null=True)
    fecha_cancelada = models.DateTimeField(blank=True, null=True)
    resumen = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'solicitud_servicio'

    def __str__(self):
        return f"Solicitud #{self.id} - {self.id_tipo_producto.descripcion}"

# --- Modelos Dependientes (Nivel 4 / Final) ---

class Envio(models.Model):
    id_solicitud_servicio = models.OneToOneField(
        SolicitudServicio, 
        models.CASCADE, # ON DELETE CASCADE
        db_column='id_solicitud_servicio'
    )
    calle = models.CharField(max_length=50)
    numero = models.IntegerField()
    piso = models.IntegerField(blank=True, null=True)
    departamento = models.CharField(max_length=50, blank=True, null=True)
    id_localidad = models.ForeignKey(
        Localidad, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_localidad'
    )
    nro_seguimiento = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'envio'


class ReparacionExterna(models.Model):
    id_solicitud = models.ForeignKey(
        SolicitudServicio, 
        models.CASCADE, # ON DELETE CASCADE
        db_column='id_solicitud'
    )
    id_empresa = models.ForeignKey(
        EmpresaExterna, 
        models.PROTECT, # Equivalente a ON DELETE RESTRICT
        db_column='id_empresa'
    )
    id_solicitud_externa = models.IntegerField()

    class Meta:
        db_table = 'reparacion_externa'