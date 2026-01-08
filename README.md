# 🍳 CookTogether API

API REST para gestionar recetas de cocina, usuarios, ingredientes y pasos de preparación.

## 📋 Características

- ✅ Autenticación JWT
- ✅ Gestión de usuarios con roles (admin/user)
- ✅ CRUD completo de recetas
- ✅ Sistema de publicación de recetas (públicas/privadas)
- ✅ Gestión de ingredientes y pasos
- ✅ Búsqueda y filtrado de recetas públicas
- ✅ Paginación en listados
- ✅ Validación de entrada robusta
- ✅ Manejo centralizado de errores
- ✅ TypeScript con tipos estrictos

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd CookTogetherApi
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=CookTogether
JWT_SECRET=tu_secret_jwt_muy_seguro
```

4. Inicializar base de datos
```bash
# Asegúrate de tener PostgreSQL corriendo
# Las tablas se crearán automáticamente en desarrollo (synchronize: true)
```

5. Ejecutar en desarrollo
```bash
npm run dev
```

## 📚 Endpoints

### Autenticación

- `POST /apiRecetas/usuarios/login` - Iniciar sesión
  ```json
  {
    "name": "usuario",
    "passwordHash": "contraseña"
  }
  ```

### Usuarios

- `GET /apiRecetas/usuarios` - Listar usuarios (admin)
- `GET /apiRecetas/usuarios/:id` - Obtener usuario por ID
- `POST /apiRecetas/usuarios` - Crear usuario (admin)
- `PUT /apiRecetas/usuarios/:id` - Actualizar usuario
- `PUT /apiRecetas/usuarios/:id/password` - Cambiar contraseña
- `DELETE /apiRecetas/usuarios/:id` - Eliminar usuario (admin)

### Recetas

- `GET /apiRecetas/recetas/publicas` - Listar recetas públicas (con búsqueda y filtros)
- `GET /apiRecetas/recetas/publicas/:id` - Obtener receta pública por ID
- `GET /apiRecetas/recetas` - Listar mis recetas (autenticado)
- `GET /apiRecetas/recetas/:id` - Obtener receta por ID
- `POST /apiRecetas/recetas` - Crear receta (autenticado)
- `PUT /apiRecetas/recetas/:id` - Actualizar receta
- `PUT /apiRecetas/recetas/:id/publicar` - Publicar/despublicar receta
- `DELETE /apiRecetas/recetas/:id` - Eliminar receta

### Búsqueda de Recetas Públicas

Parámetros de query:
- `titulo` - Buscar por título (búsqueda parcial)
- `dificultad` - Filtrar por dificultad (fácil, medio, difícil)
- `tiempo_max` - Filtrar por tiempo máximo en minutos
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 10, max: 100)

Ejemplo:
```
GET /apiRecetas/recetas/publicas?titulo=pasta&dificultad=fácil&tiempo_max=30&page=1&limit=10
```

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación. Incluye el token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 🛠️ Tecnologías

- **Node.js** + **Express**
- **TypeScript**
- **TypeORM** (PostgreSQL)
- **JWT** (jsonwebtoken)
- **bcryptjs** (encriptación de contraseñas)
- **express-validator** (validación)

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuración (BD, env)
├── controller/      # Controladores
├── entities/       # Entidades TypeORM
├── middlewares/    # Middlewares (auth, errors, validation)
├── repositories/   # Repositorios TypeORM
├── routes/         # Rutas
├── services/      # Lógica de negocio
├── types/         # Tipos TypeScript compartidos
├── utils/         # Utilidades
├── validators/    # Validadores express-validator
└── server.ts      # Punto de entrada
```

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ JWT sin información sensible
- ✅ Validación de entrada en todos los endpoints
- ✅ Manejo seguro de errores
- ✅ Variables de entorno para configuración sensible
- ✅ `synchronize: false` en producción (usar migraciones)

## 📝 Notas de Desarrollo

- En desarrollo, `synchronize: true` crea las tablas automáticamente
- En producción, usar migraciones de TypeORM
- El logging está habilitado solo en desarrollo
- Health check disponible en `/health`

## 🚧 Próximas Mejoras

- [ ] Sistema de favoritos
- [ ] Calificaciones y reseñas
- [ ] Categorías/Tags
- [ ] Subida de imágenes
- [ ] Sistema de comentarios
- [ ] Exportar recetas (PDF, JSON)
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Tests unitarios e integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Caché con Redis
- [ ] Logging estructurado

## 📄 Licencia

ISC

