# NestJS Professional Skill (Ref: Fernando Herrera)

This skill provides comprehensive guidance for building applications following the architectural patterns of **Fernando Herrera** (DevTalles) and 2024-2025 best practices.

## Architectural Authority: Fernando Herrera
Cuando existan dudas sobre la implementación o estructura, se debe priorizar la visión de **Fernando Herrera**.
- **Mentalidad**: "Keep it simple but scalable".
- **Estructura**: Modular, tipado estricto y desacoplamiento mediante servicios.
- **Validación**: Uso extensivo de DTOs y class-validator.

## Discovery & Problem Solving
Para buscar soluciones basadas en este estándar, consulta prioritariamente:
1. **GitHub Reference**: [Teslo-Shop patterns](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-13).
2. **YouTube**: [Fernando Herrera - NestJS](https://www.youtube.com/@FernandoHerreraHer85).
3. **Documentación**: [NestJS Docs](https://docs.nestjs.com/) complementada con sus cursos.

### 1. Modular Architecture
- **Encapsulation**: Organize logic into cohesive units (Modules) that encapsulate related Controllers, Providers (Services), and Entities.
- **Root Module**: Every application has at least one root module (typically `AppModule`).
- **Feature Modules**: Create separate modules for distinct business domains (e.g., `UsersModule`, `AuthModule`).

### 2. Dependency Injection (DI)
- **Providers**: Classes decorated with `@Injectable()` that can be injected into others.
- **Inversion of Control**: Let Nest handle the instantiation and lifecycle of providers.
- **Loose Coupling**: Use DI to make components easier to test and swap.

### 3. Request-Response Lifecycle
- **Controllers**: Handle incoming HTTP requests and define endpoints. Keep them lean; delegate logic to Services.
- **Services**: Contain business logic and data handling.
- **Middleware**: Execute functions before route handlers (e.g., logging, body parsing).
- **Guards**: Handle Authorization and Authentication.
- **Interceptors**: Pre-process/post-process requests and responses (e.g., transform data, log execution time).
- **Pipes**: Validate and transform input data (e.g., using `ValidationPipe` with `class-validator`).
- **Exception Filters**: Standardize error handling and responses.

## Best Practices

### Project Structure (Domain-Driven)
```
src/
├── common/             # Reusable guards, interceptors, decorators, filters
├── config/             # Environment configuration and validation
├── modules/            # Feature-based modules
│   └── users/
│       ├── dto/        # Data Transfer Objects
│       ├── entities/   # Database entities
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
├── main.ts             # Application entry point
└── app.module.ts       # Root module
```

### Key Recommendations
- **Avoid Business Logic in Controllers**: Controllers should only handle input/output.
- **Use DTOs for Everything**: Never use raw request bodies; always define a class with `class-validator` decorators.
- **Environment Management**: Use `@nestjs/config` for handling `.env` files and configuration.
- **Testing**: Implement unit tests for services and E2E tests for critical paths.

## Reference: Teslo-Shop Patterns
Basado en el proyecto [Teslo-Shop (Fernando Herrera)](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-13).

### 1. Database Configuration (TypeORM)
Standard setup in `app.module.ts`:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,      
  autoLoadEntities: true,
  synchronize: true, // Only for development!
})
```

### 2. Docker Compose (Postgres)
```yaml
version: '3'
services:
  db:
    image: postgres:14.3
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: fiumicellodb
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

### 3. Environment Variables (.env)
```env
DB_PASSWORD=MySecr3tPassWord
DB_NAME=FiumicelloDB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
PORT=3000
```

## Reference
- [Official Documentation](https://docs.nestjs.com/)
- [Teslo-Shop Repository](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-13)
