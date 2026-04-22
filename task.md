# Task

Implementación del frontend de chat social tipo Café/IRC.

## Alcance

- Barra superior fija con `Perfil`, cambio de tema, título del tema activo, `Contacto admin` y `Tienda`.
- Desktop con cinco paneles:
  - temas
  - crear nuevo tema
  - chat principal
  - usuarios conectados
  - rankings
- Mobile simplificado con:
  - vista principal con temas y creación
  - chat al entrar en un tema
  - menús hamburguesa laterales para temas, usuarios y rankings
- Estado local sin tiempo real.
- Botón manual de `Actualizar` con SVG.
- 20 temas visibles por defecto.
- Cada tema conserva solo los últimos 30 mensajes.
- Ranking global y ranking por tema con selector por flechas.

## Notas

- Implementado como frontend autocontenido en HTML, CSS y JS puros.
- No se añadió backend ni sincronización en tiempo real.
