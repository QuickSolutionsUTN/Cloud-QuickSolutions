# Veloway API

## Descripción
Nuestra API brinda un servicio donde se podrá realizar y consultar envios a domicilio.

## Endpoints
### Para realizar un envio
- POST /api/envios/create
- Request Body:
```json
{
  "descripcion": "Envio de paquete",
  "hora": "19:30",
  "pesoGramos": 500,
  "origen": {
    "calle": "8",
    "numero": 2354,
    "piso": null,
    "depto": null,
    "descripcion": "Rejas negras",
    "localidadID": 3
  },
  "destino": {
    "calle": "55",
    "numero": 1224,
    "piso": 2,
    "depto": "B",
    "descripcion": "Edificio verde",
    "localidadID": 3
  },
  "cliente": "uuid del cliente",
}
```

### Para consultar un envio
- GET /api/envios/nro-seguimiento/{nro_seguimiento}

### Para obtener todas las localidades
- GET /api/localidades

