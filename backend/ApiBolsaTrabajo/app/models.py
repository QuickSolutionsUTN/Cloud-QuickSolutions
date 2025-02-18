from django.db import models
from django.contrib.postgres.fields import ArrayField

class Admins(models.Model):
    idadmin = models.AutoField(db_column='idAdmin', primary_key=True)
    email = models.TextField()
    contrasena = models.TextField()

    class Meta:
        db_table = 'Admins'

class Provincia(models.Model):
    idprovincia = models.AutoField(db_column='idProvincia', primary_key=True)
    nombre = models.TextField()

    class Meta:
        db_table = 'Provincia'

class Localidad(models.Model):
    idlocalidad = models.AutoField(db_column='idLocalidad', primary_key=True)
    nombre = models.TextField()
    idprovincia = models.ForeignKey(Provincia, db_column='idprovincia', on_delete=models.CASCADE)

class Meta:
    db_table = 'Localidad'


class Profesion(models.Model):
    idprofesion = models.AutoField(db_column='idProfesion', primary_key=True)
    nombre = models.TextField()

    class Meta:
        db_table = 'Profesion'


class Trabajador(models.Model):

    ESTADO_TRABAJO_CHOICES = [
        ('disponible', 'Disponible'),
        ('ocupado', 'Ocupado'),
        ('inactivo', 'Inactivo'),
    ]

    idtrabajador = models.AutoField(db_column='idTrabajador', primary_key=True)
    nombre = models.TextField()
    apellido = models.TextField()
    uniforme = models.BooleanField(default=False)
    talle = models.TextField()
    dni = models.IntegerField(db_column='dni')
    email = models.TextField()
    numtel = models.IntegerField(db_column='numTel')
    edad = models.IntegerField()
    descripcion = models.TextField()
    estadotrabajo = models.CharField(
        db_column='estadoTrabajo',
        max_length=20,
        choices=ESTADO_TRABAJO_CHOICES,
        default='disponible',
    )
    estadocontrato = models.TextField(
        db_column='estadoContrato',
        choices=[('pendiente', 'Pendiente'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')],
        default='pendiente'
    )
    idprofesion = models.ForeignKey(Profesion, db_column='idProfesion', on_delete=models.CASCADE)
    idlocalidad = models.ForeignKey(Localidad, db_column='idLocalidad', on_delete=models.CASCADE)
    imagenlink = models.ImageField(upload_to='photos/', blank=True)
    cvlink = models.FileField(upload_to='cv/', blank=True)

    class Meta:
        db_table = 'Trabajador'


class Solicitud(models.Model):
    idsolicitud = models.AutoField(db_column='idSolicitud', primary_key=True)
    empresa = models.TextField()
    idtrabajadores = models.ManyToManyField(Trabajador, related_name='solicitudes')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    def __str__(self):
        return f"Solicitud desde {self.fecha_inicio} hasta {self.fecha_fin}"
    
    class Meta:
        db_table = 'Solicitud'


class Trabajadorxprofesion(models.Model):
    idtrabajador = models.ForeignKey(Trabajador,db_column='idTrabajador', on_delete=models.CASCADE)
    idprofesion = models.ForeignKey(Profesion,db_column='idProfesion', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'TrabajadorxProfesion'


class Valoracion(models.Model):
    idvaloracion = models.AutoField(db_column='idValoracion', primary_key=True)
    estrellas = models.IntegerField()
    opinion = models.TextField(blank=True, null=True)
    idtrabajador = models.ForeignKey(Trabajador,db_column='idTrabajador', on_delete=models.CASCADE)

    class Meta:
        db_table = 'Valoracion'
        
class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    first_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'

class Pedido(models.Model):
    MANGA_CHOICES = [
        ('largo','Largo'),
        ('corto','Corto'),
    ]
    TALLE_CHOICES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL','Extra-Large'),
        ('XXL','Extra-extra-large')
    ]
    
    manga = models.TextField(choices=MANGA_CHOICES)
    talle = models.TextField(choices=TALLE_CHOICES)
    class Meta:
        db_table = 'Pedido'

