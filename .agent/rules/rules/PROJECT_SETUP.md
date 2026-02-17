# Project Persistence and Session Continuity

Para asegurar que el desarrollo de **Fiumicello_Backend** siga las bases establecidas, el asistente debe siempre seguir estas reglas al iniciar o retomar la sesión:

## 1. Reglas de Desarrollo (Rules)
- **Consultar siempre**: `rules/Gemini.md` antes de cualquier implementación.
- **Seguir las directrices** de robustez, legibilidad y seguridad definidas en ese archivo.

## 2. Capacidades Especializadas (Skills)
- **Cargar la Skill de NestJS**: Ubicada en `.agent\skills\nestjs\SKILL.md`.
- **Cargar la Skill de Docker**: Ubicada en `.agent\skills\docker\SKILL.md`.
- **Aplicar patrones** de Arquitectura Modular, Inyección de Dependencias y mejores prácticas de NestJS/Docker (2024-2025).

## 3. Conectividad MCP
- **Servidor MCP NestJS**: Utilizar la configuración en `mcp_config.json` para interactuar con las herramientas de NestJS.

## 4. Estructura del Proyecto
- **Respetar la jerarquía**: Las nuevas secciones deben seguir el orden definido en `project_devoloper/` (ej. `1-PostgresDB.md`, `2-OnBoarding.md`).

> [!IMPORTANT]
> Nunca procedas con un cambio arquitectónico significativo sin antes verificar si existe un patrón documentado en las **Skills** o **Rules**.
