quisiera generar la documentacion con swager utilizando las mejores practicas de la documentacion de nestjs  y la de fernando herrera utlizando los tags para agrupar las rutas con decoradores que te indiquen claramente el crud al que se refiere, 

ApiProperty, Api Response dependiendo de las caracteristicas de cada ruta y el contenido de su respuesta mapear cuales respuestas puede generar en los casos en que falle o tenga algun error y cuando su respuesta sea la esperada com seria la estructura de la respuesta y los campos que contiene.

## Seguridad y Permisos (Claims-based)
El proyecto utiliza un sistema de seguridad dinámico basado en permisos (`PermissionsGuard`) en lugar de roles duros.
Para proteger una ruta, se debe utilizar el decorador `@RequirePermissions('nombre_del_permiso')` junto con `PermissionsGuard`.

Ejemplo de uso:
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('utilities:users')
@Get()
findAll() {
  // ...
}
```
Esto asegura que la asignación de accesos se pueda cambiar gráficamente desde la aplicación Flutter y se aplique de inmediato sin necesidad de tocar el código del backend.