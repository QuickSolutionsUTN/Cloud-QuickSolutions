import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import Usuario 

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # 1. Obtener el header Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None  # Si no hay header, dejamos que los permisos decidan si rechazan

        try:
            # 2. Separar "Bearer" del token
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None

        # 3. Decodificar el token usando el secreto de Supabase
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('El token ha expirado')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Token inválido')

        # 4. Vincular el token con un usuario de tu base de datos Django
        # El 'sub' en el token de Supabase es el UUID del usuario
        user_id = payload.get('sub')
        
        try:
            user = Usuario.objects.get(pk=user_id)
        except Usuario.DoesNotExist:
            raise exceptions.AuthenticationFailed('Usuario no encontrado en la base de datos local')

        return (user, None)