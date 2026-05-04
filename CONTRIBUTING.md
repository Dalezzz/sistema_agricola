# Guía de Contribución

## Configuración del Entorno

### Requisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker (opcional pero recomendado)

### Setup Local

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd sistema_agricola
   ```

2. **Instalar dependencias**
   ```bash
   # Backend
   cd backend
   npm install
   cd ..

   # Frontend
   cd frontend
   npm install
   cd ..

   # ML Service
   cd ml-service
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con credenciales locales
   ```

4. **Iniciar servicios**
   ```bash
   docker-compose up -d
   ```

## Workflow de Desarrollo

### Crear una rama
```bash
git checkout -b feature/tu-feature-name
# o
git checkout -b bugfix/tu-bug-fix
```

### Commits
- Usar commit messages descriptivos en español
- Formato: `type(scope): descripción`
- Ejemplos:
  - `feat(auth): agregar autenticación JWT`
  - `fix(plots): corregir validación de lotes`
  - `docs: actualizar README`

### Testing

#### Backend
```bash
cd backend
npm test                   # Ejecutar tests
npm run test:watch       # Watch mode
npm run test:cov         # Con cobertura
```

#### Frontend
```bash
cd frontend
npm test                  # Ejecutar tests
npm run test:watch      # Watch mode
```

### Linting
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

## Estándares de Código

### TypeScript
- Usar tipos explícitos siempre que sea posible
- Evitar `any` - usar `unknown` o tipos genéricos
- Mantener archivos menores a 300 líneas

### Componentes React
- Usar `export default` para components
- Usar composición sobre herencia
- Mantener componentes puros

### Estilos
- Usar Tailwind CSS clases
- No agregar CSS custom si es evitable
- Respetar la estructura de spacing y colores

## Proceso de Pull Request

1. **Push de cambios**
   ```bash
   git add .
   git commit -m "feat(module): descripción"
   git push origin feature/tu-feature-name
   ```

2. **Abrir PR**
   - Título descriptivo
   - Descripción del cambio
   - Screenshots si es UI
   - Referenciar issues relacionados

3. **Code Review**
   - Responder comentarios
   - Hacer cambios solicitados
   - Re-request review cuando esté listo

4. **Merge**
   - Usar "Squash and merge" para features
   - Usar "Create a merge commit" para releases

## Estructura de Carpetas

```
src/
├── components/      # Componentes reutilizables
├── pages/          # Páginas de la aplicación
├── services/       # Lógica de negocio
├── utils/          # Funciones auxiliares
├── types/          # Tipos TypeScript
└── hooks/          # Custom React hooks
```

## Convenciones de Nombres

- **Carpetas**: kebab-case (`my-component/`)
- **Archivos**: PascalCase para componentes (`MyComponent.tsx`)
- **Archivos**: camelCase para utilities (`myHelper.ts`)
- **Variables/Funciones**: camelCase (`myVariable`, `myFunction()`)
- **Constantes**: SCREAMING_SNAKE_CASE (`MAX_RETRIES`)

## Documentación

- Documentar funciones públicas
- Usar comentarios para lógica compleja
- Actualizar README cuando sea necesario
- Agregar ejemplos de uso cuando sea relevante

## Performance

- Evitar renders innecesarios
- Usar `useMemo` y `useCallback` apropiadamente
- Mantener bundle size bajo
- Optimizar imágenes

## Seguridad

- Nunca commitear `.env` archivos
- Validar input del usuario
- Sanitizar datos de API
- Usar HTTPS en producción

## Ayuda

- Issues: Para reportar bugs o sugerir features
- Discussions: Para preguntas y discusiones
- Slack/Discord: Para comunicación en tiempo real

¡Gracias por contribuir! 🚀
