# QuickSolutions

**QuickSolutions** es una aplicación web para solicitar y gestionar reparaciones de electrodomésticos del hogar.  
Los usuarios pueden registrar un problema (por ejemplo, lavarropas roto) y los técnicos pueden aceptar o rechazar las solicitudes, recibiendo notificaciones cuando cambia el estado.

## 🏗️ Tecnologías

- **Frontend:** React + Vite
- **Backend:** Django (migrado desde .NET)
- **Cloud Services:**
  - **Supabase:** autenticación, base de datos y API REST
  - **AWS SNS:** envío de notificaciones a usuarios

## ⚙️ Arquitectura

1. El frontend consume directamente los endpoints de Supabase para autenticación y CRUD de pedidos.
2. Django gestiona la lógica de negocio y coordina el envío de notificaciones a través de AWS.
3. Los cambios de estado en las reparaciones se reflejan en tiempo real mediante Supabase Realtime.

## 🚀 Próximos pasos
- Crear la base de datos en Supabase (tablas: usuarios, reparaciones, técnicos).
- Conectar React con Supabase Auth y CRUD.
- Integrar AWS SNS o SES para notificaciones automáticas.
- Desplegar la app en Vercel o Netlify.

## 👨‍💻 Equipo de Trabajo

- Alvite Damian
- Capre Rodrigo
- Elizalde Benjamin
- Pascual Agustin

