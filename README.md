# QuickSolutions

**QuickSolutions** es una aplicación web para solicitar y gestionar reparaciones de electrodomésticos del hogar.  
Los usuarios pueden registrar un problema (por ejemplo, lavarropas roto) y los técnicos pueden aceptar o rechazar las solicitudes, recibiendo notificaciones cuando cambia el estado.

## 🚀 Cómo ejecutar el proyecto

Para levantar el entorno de desarrollo localmente, necesitarás abrir dos terminales.

### 🐍 Backend

Desde la carpeta raíz del proyecto, navega al backend, instala las dependencias y corre el servidor:

``` bash
cd backend
python -m pip install -r requirements.txt
python manage.py runserver
```

### ⚛️ Frontend

Navega a la carpeta del cliente, instala las dependencias y levanta el entorno de desarrollo:

``` bash
cd frontend/proyect-front
npm install
npm run dev
```

## 🏗️ Tecnologías

- **Frontend:** React + Vite
- **Backend:** Django (migrado desde .NET)
- **Cloud Services:**
  - **Supabase:** autenticación, base de datos y API REST
  - **AWS SNS:** envío de notificaciones a usuarios
  - **AWS Amplify Hosting:** deployar el frontend

## ⚙️ Arquitectura

1. El frontend consume directamente los endpoints de Supabase para autenticación y CRUD de pedidos.
2. Django gestiona la lógica de negocio y coordina el envío de notificaciones a través de AWS.
3. Los cambios de estado en las reparaciones se reflejan en tiempo real mediante Supabase Realtime.

## 🛠️ Estado del Proyecto

El proyecto ya se encuentra listo.
El backend esta deployado con Render y el frontend con aws amplify

Link a la pagina web: https://main.d2pw1l29dsqfgg.amplifyapp.com/

## 👨‍💻 Equipo de Trabajo

- Alvite Damian
- Capre Rodrigo
- Elizalde Benjamin
- Pascual Agustin

## Convenciones de ramas (Branch Naming)

Para mantener un orden claro en el repositorio, seguimos estas convenciones para nombrar las ramas, usando guion bajo `_` (**snake_case**) para separar palabras dentro del nombre, y slash `/` para separar el prefijo del nombre de la rama:

| Prefijo    | Uso principal                                            | Ejemplo                     |
|------------|---------------------------------------------------------|-----------------------------|
| `feature/` | Nuevas funcionalidades o mejoras                         | `feature/agregar_login`     |
| `fix/`     | Corrección de errores o bugs                             | `fix/arreglar_error_login`  |
| `infra/`   | Cambios en infraestructura y configuraciones técnicas   | `infra/configurar_dockerfile`|
| `refactor/`| Cambios en código para mejorar estructura o legibilidad sin agregar ni arreglar funcionalidad | `refactor/limpieza_codigo`  |
| `docs/`    | Cambios o mejoras en la documentación                    | `docs/actualizar_readme`    |
| `migration/`| Cambio de tecnología, framework o esquema de BD | `migration/dotnet-to-django`|