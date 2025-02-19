# En 'app/utils.py'
import jwt
from datetime import timedelta, datetime
from django.conf import settings
from .models import Admins  # Cambia esto si usas otro modelo de usuario
from rest_framework.response import Response
from rest_framework.decorators import api_view

SECRET_KEY = settings.SECRET_KEY

def create_access_token(admin):
    """
    Esta función genera un token de acceso (JWT) para un administrador.
    Primero, establece un tiempo de expiración de una hora a partir del momento actual.
    Luego, crea un diccionario (payload) con información del usuario, como su ID y email,
    además de la fecha de expiración.
    Finalmente, el payload se codifica usando la clave secreta y se devuelve como un token JWT.
    """

    expiration_time = datetime.utcnow() + timedelta(hours=1)
    
    payload = {
        "user_id": admin.idadmin,
        'idadmin': admin.idadmin,
        'email': admin.email,
        'exp': expiration_time,  # Expiración del token
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    return token


@api_view(["GET"])
def validar_token_view(request):
    """
    Esta función verifica si el token almacenado en las cookies del usuario es válido.
    Primero, obtiene el token desde la cookie 'access_token'.
    Si el token no existe, devuelve un mensaje de error con estado 401 (no autorizado).
    Luego, intenta decodificar el token con la clave secreta.
    Si el token es válido, devuelve un mensaje indicando que es correcto y muestra su contenido.
    Si el token ha expirado o es inválido, devuelve un error correspondiente con estado 401.
    """

    token = request.COOKIES.get("access_token")  # Obtener token de la cookie

    if not token:
        return Response({"valido": False, "error": "Token no proporcionado"}, status=401)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return Response({"valido": True, "data": payload}, status=200)
    except jwt.ExpiredSignatureError:
        return Response({"valido": False, "error": "Token expirado"}, status=401)
    except jwt.InvalidTokenError:
        return Response({"valido": False, "error": "Token inválido"}, status=401)
