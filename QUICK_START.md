# Comandos Rápidos

## Instalación Inicial

```bash
# Clonar/Navegar
cd sistema_agricola

# Variables de entorno
cp .env.example .env

# Con Docker (Recomendado)
docker-compose up -d

# Ejecutar migraciones
docker-compose exec backend npx prisma migrate dev
```

## Desarrollo Local

### Backend
```bash
cd backend

# Instalar
npm install

# Desarrollo
npm run start:dev

# Testing
npm test

# Linting
npm run lint
```

### Frontend
```bash
cd frontend

# Instalar
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

### ML Service
```bash
cd ml-service

# Instalar
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Ejecutar
python main.py
```

## Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ml-service

# Detener
docker-compose down

# Reconstruir
docker-compose build
```

## Base de Datos

```bash
# Migraciones Prisma
cd backend
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
npx prisma migrate reset
npx prisma db push

# Studio (GUI)
npx prisma studio
```

## Git

```bash
# Crear rama
git checkout -b feature/nombre

# Commits
git add .
git commit -m "feat(modulo): descripción"

# Push
git push origin feature/nombre
```

## Testing

```bash
# Backend
cd backend
npm test
npm run test:watch
npm run test:cov

# Frontend
cd frontend
npm test
npm run test:watch
```

## Build & Deploy

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start

# Docker
docker build -t sistema-agricola-backend ./backend
docker build -t sistema-agricola-frontend ./frontend
```

## Troubleshooting

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar Docker
docker-compose down -v
docker system prune

# Resetear BD
docker-compose exec postgres psql -U agricola -d sistema_agricola -f /dev/null
```

## Variables de Entorno Clave

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=your_secret_key
N8N_PASSWORD=admin123
```

---

Para más detalles, ver **README.md** y **CONTRIBUTING.md**
