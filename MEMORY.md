# MEMORY — UniForms
Reserva de salas e equipamentos com fluxo de aprovação (Programação Radical 2025, UNIVAG).

## Stack
- Frontend estático: HTML/CSS/JS puro (`frontend/*.html`, `css/`, `js/`, `img/`); sem backend nem build.

## Comandos
- Abrir `frontend/index.html` ou servir a pasta (`python -m http.server` dentro de `frontend/`).

## Variáveis de ambiente
- Nenhuma.

## Regras de ouro
1. Páginas por fluxo: `room-scheduling`, `equipment-scheduling`, `approvals` (coordenador) e `dashboard`.
2. Sem dependências nem build: manter HTML/CSS/JS vanilla.
3. Estilos em `css/` e scripts em `js/`; evitar JS inline.
