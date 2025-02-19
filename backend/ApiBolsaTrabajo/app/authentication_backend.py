import jwt
from rest_framework import authentication, exceptions
from django.conf import settings
from .models import Admins  # Cambia esto si usas otro modelo de usuario

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Obtener el token de las cookies
        token = request.COOKIES.get('access_token')

        # Si no hay token, retornar None (deja que otros métodos de autenticación lo manejen)
        if not token:
            return None

        try:
            # Decodificar el token JWT con la clave secreta
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token ha expirado')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Token inválido')

        # Obtener el idadmin y email del payload
        user_id = payload.get('idadmin')
        email = payload.get('email')
        
        if not user_id or not email:
            raise exceptions.AuthenticationFailed('Usuario no encontrado en el token')

        try:
            # Buscar al usuario usando el idadmin
            user = Admins.objects.get(idadmin=user_id)
        except Admins.DoesNotExist:
            raise exceptions.AuthenticationFailed('Usuario no encontrado')

        # Si el token es válido, retornar el usuario y None (la segunda parte es la autenticación del token)
        return (user, None)


