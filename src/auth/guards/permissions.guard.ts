import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Obtenemos los permisos requeridos por el decorador en el controlador/ruta
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        // Si la ruta no requiere permisos específicos, permitimos el acceso
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        // Obtenemos el usuario de la petición (inyectado previamente por el JwtStrategy)
        const { user } = context.switchToHttp().getRequest();

        // Verificamos si el usuario y sus permisos existen
        if (!user || !user.permissions || !Array.isArray(user.permissions)) {
            throw new ForbiddenException('User permissions not found');
        }

        // Verificamos si el usuario tiene TODOS los permisos requeridos
        // O alternativamente, si tiene AL MENOS UNO. (Depende de la regla de negocio)
        // Por defecto en estos sistemas, un decorador con varios parámetros significa "Debe tener al menos uno de estos" (OR)
        const hasPermission = requiredPermissions.some((permission) => 
            user.permissions.includes(permission) || user.permissions.includes('all')
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
