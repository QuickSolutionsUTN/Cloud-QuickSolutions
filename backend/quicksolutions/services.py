import boto3
import json
from django.conf import settings

def publicar_evento_sns(datos):
    """
    Recibe un diccionario (datos) y lo publica en SNS como JSON.
    """
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION_NAME
    )
    
    # Convertimos el dict de Python a String JSON
    mensaje_json = json.dumps(datos)

    client.publish(
        TopicArn=settings.SNS_TOPIC_ARN,
        Message=mensaje_json,
        Subject="Actualizacion Solicitud" # Este subject es interno para AWS
    )