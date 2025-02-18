# En 'app/utils.py'
import jwt
from datetime import timedelta, datetime
from django.conf import settings
from .models import Admins  # Cambia esto si usas otro modelo de usuario
from rest_framework.response import Response
from rest_framework.decorators import api_view

SECRET_KEY = settings.SECRET_KEY

def create_access_token(admin):
    
    # Define el tiempo de expiración (por ejemplo, 5 minutos)
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    
    # Crea el payload del token con la fecha de expiración
    payload = {
        "user_id": admin.idadmin,
        'idadmin': admin.idadmin,
        'email': admin.email,
        'exp': expiration_time,  # Expiración del token
    }
    
    # Genera el token (asegurándote de que la clave secreta sea correcta)
    token = jwt.encode(payload,SECRET_KEY, algorithm='HS256')
    
    return token


@api_view(["GET"])
def validar_token_view(request):
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

    