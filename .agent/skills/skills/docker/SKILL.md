# Docker Development Skill

Esta skill proporciona conocimiento especializado para utilizar Docker como herramienta de desarrollo, centrándose en la eficiencia, seguridad y mejores prácticas para Node.js/NestJS.

## Conceptos Core de Docker

### 1. Imágenes vs Contenedores
- **Imagen**: Un paquete ejecutable, autónomo y ligero que incluye todo lo necesario para ejecutar una pieza de software (código, runtime, herramientas, librerías, configuraciones).
- **Contenedor**: Una instancia en ejecución de una imagen. Es una unidad estándar de software que empaqueta el código y todas sus dependencias.

### 2. Docker Compose
- Herramienta para definir y ejecutar aplicaciones multi-contenedor.
- Usa un archivo `docker-compose.yaml` para configurar los servicios de la aplicación (BD, Backend, Frontend, etc.).
- **Comandos Clave**:
    - `docker-compose up -d`: Inicia los servicios en segundo plano.
    - `docker-compose logs -f`: Sigue los logs de los contenedores.
    - `docker-compose down`: Detiene y elimina los contenedores, redes e imágenes.

### 3. Persistencia (Volumes)
- Los contenedores son efímeros; los datos se pierden al eliminarlos.
- **Volumes**: Se utilizan para persistir datos fuera del contenedor (ej: `/var/lib/postgresql/data` para una base de datos).

## Mejores Prácticas para Desarrollo (Node.js)

### .dockerignore
Siempre incluye un archivo `.dockerignore` para evitar copiar archivos innecesarios al contexto de construcción:
```text
node_modules
npm-debug.log
Dockerfile
docker-compose.yaml
.git
.env
```

### Multi-stage Builds (Producción)
Separa el entorno de construcción del entorno de ejecución para reducir el tamaño de la imagen:
1. **Stage 1 (Build)**: Instalar dependencias completas y compilar (NestJS).
2. **Stage 2 (Runtime)**: Copiar solo los archivos compilados (`dist/`) y las dependencias de producción.

### Imagen Base Optimizada
- Usa imágenes ligeras como `node:alpine` o `node:slim` para reducir el tamaño y la superficie de ataque.

### Ejecución Segura
- **No usar Root**: Siempre que sea posible, ejecuta el proceso con un usuario sin privilegios (ej: `USER node`).

## Referencias
- [Documentación Oficial de Docker](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Best Practices - Node.js](https://docs.docker.com/get-started/02_our_app/)
