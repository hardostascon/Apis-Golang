# 🌤️ Apis-Golang - Colección de APIs RESTful

[![Go Version](https://img.shields.io/badge/Go-1.19+-00ADD8?logo=go)](https://golang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-76.2%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/hardostascon/Apis-Golang?style=social)](https://github.com/hardostascon/Apis-Golang)

> **Colección de APIs RESTful desarrolladas con Golang y TypeScript para diversos servicios y aplicaciones**

---

## 📋 Descripción

**Apis-Golang** es un repositorio que contiene una colección de servicios API construidos con tecnologías modernas como **Golang** (22.8%) y **TypeScript** (76.2%). El proyecto incluye implementaciones de APIs para diferentes propósitos, con un enfoque en arquitectura limpia, buenas prácticas de desarrollo y código escalable.

### 🎯 Objetivo del Proyecto

Proporcionar implementaciones de referencia de APIs RESTful bien diseñadas, documentadas y listas para usar en proyectos reales, sirviendo tanto como ejemplos educativos como como base para aplicaciones en producción.

---

## 🗂️ APIs Disponibles

### 🌤️ Weather API

API de clima que proporciona información meteorológica en tiempo real y pronósticos.

**Características:**
- ✅ Consulta de clima actual por ubicación
- ✅ Pronóstico extendido
- ✅ Datos de temperatura, humedad, velocidad del viento
- ✅ Integración con servicios meteorológicos externos
- ✅ Caché de respuestas para optimizar rendimiento
- ✅ Rate limiting para control de uso

**Endpoints disponibles:**
```
GET  /api/weather/current?city={city}      # Clima actual
GET  /api/weather/forecast?city={city}     # Pronóstico
GET  /api/weather/location?lat={lat}&lon={lon}  # Por coordenadas
```

---

## 🛠️ Stack Tecnológico

### Backend
```
🔹 Lenguaje Principal: Go (Golang) 22.8%
🔹 Framework: Gin
🔹 Base de Datos: PostgreSQL/MySQL/MongoDB
🔹 API Documentation: OpenAPI
```

### Frontend/Client
```
🔹 TypeScript: 76.2%
🔹 JavaScript: 1.0%
🔹 Framework: React Native
🔹 Build Tool: Webpack/Vite
```

### DevOps & Tools
```
🔹 Containerización: Docker
🔹 CI/CD: GitHub Actions
🔹 Testing: Go testing + Jest/Vitest
🔹 Linting: golangci-lint, ESLint
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Go** 1.19 o superior → [Descargar](https://golang.org/dl/)
- **npm** o **yarn**
- **Redis** (opcional, para caché) → [Descargar](https://redis.io/download)
- **Git** para control de versiones

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/hardostascon/Apis-Golang.git
cd Apis-Golang
```

### 2. Configuración de la Weather API

#### Backend (Go)

```bash
# Navegar a la carpeta de Weather API
cd Wheater

# Descargar dependencias de Go
go mod download

# Crear archivo de configuración
cp .env.example .env

# Editar variables de entorno
nano .env
```

**Ejemplo de archivo `.env`:**
```env
# Server Configuration
PORT=8080
HOST=localhost
ENVIRONMENT=development

# External Weather API
WEATHER_API_KEY=tu_api_key_aqui
WEATHER_API_URL=https://api.weatherapi.com/v1

# Redis Configuration (Cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Database (si aplica)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=weather_api_db
```

#### Frontend/Client

```bash
# Si existe carpeta de cliente
cd client  # o la carpeta correspondiente

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

**Ejemplo de `.env` del cliente:**
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Weather API Client
```

### 3. Ejecutar el Proyecto

#### Iniciar Backend (Weather API):

```bash
cd Wheater

# Modo desarrollo
go run main.go

# O compilar y ejecutar
go build -o weather-api
./weather-api
```

El servidor estará disponible en: `http://localhost:8080`

#### Iniciar Cliente (si aplica):

```bash
cd client

# Modo desarrollo
npm run dev

# Build de producción
npm run build
```

---

## 📁 Estructura del Proyecto

```
Apis-Golang/
│
├── Wheater/                      # API de Clima
│   ├── cmd/                      # Punto de entrada de la aplicación
│   │   └── main.go
│   ├── internal/                 # Código interno de la API
│   │   ├── handlers/             # Handlers HTTP
│   │   ├── models/               # Modelos de datos
│   │   ├── services/             # Lógica de negocio
│   │   ├── repositories/         # Capa de acceso a datos
│   │   ├── middleware/           # Middlewares (auth, cors, etc.)
│   │   └── routes/               # Definición de rutas
│   ├── pkg/                      # Paquetes compartidos
│   │   ├── cache/                # Sistema de caché (Redis)
│   │   ├── httpclient/           # Cliente HTTP
│   │   ├── logger/               # Sistema de logs
│   │   └── utils/                # Utilidades
│   ├── config/                   # Configuración
│   ├── docs/                     # Documentación Swagger
│   ├── tests/                    # Tests
│   ├── go.mod                    # Dependencias Go
│   ├── go.sum                    # Checksums
│   ├── Dockerfile                # Contenedor Docker
│   └── README.md                 # Documentación específica
│
├── client/                       # Cliente TypeScript (si aplica)
│   ├── src/
│   │   ├── components/           # Componentes UI
│   │   ├── services/             # Servicios API
│   │   ├── types/                # Tipos TypeScript
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                       # Código compartido entre APIs
│   ├── types/                    # Tipos TypeScript compartidos
│   └── utils/                    # Utilidades compartidas
│
├── docker-compose.yml            # Composición de servicios
├── .gitignore
├── LICENSE
└── README.md                     # Este archivo
```

---

## 🌐 Weather API - Documentación

### Obtener Clima Actual

**Endpoint:** `GET /api/weather/current`

**Query Parameters:**
- `city` (string, required): Nombre de la ciudad
- `country` (string, optional): Código del país (ISO 2 letras)
- `units` (string, optional): Sistema de unidades (`metric`, `imperial`)

**Ejemplo de Petición:**
```bash
curl -X GET "http://localhost:8080/api/weather/current?city=Bogota&country=CO&units=metric"
```

**Ejemplo de Respuesta:**
```json
{
  "status": "success",
  "data": {
    "location": {
      "city": "Bogotá",
      "country": "Colombia",
      "coordinates": {
        "latitude": 4.7110,
        "longitude": -74.0721
      }
    },
    "weather": {
      "temperature": 14.5,
      "feels_like": 13.2,
      "humidity": 82,
      "pressure": 1013,
      "description": "Nublado",
      "icon": "04d",
      "wind_speed": 3.5,
      "wind_direction": "NE"
    },
    "timestamp": "2026-02-13T14:30:00Z"
  }
}
```

### Obtener Pronóstico Extendido

**Endpoint:** `GET /api/weather/forecast`

**Query Parameters:**
- `city` (string, required): Nombre de la ciudad
- `days` (integer, optional): Número de días (1-7, default: 5)
- `units` (string, optional): Sistema de unidades

**Ejemplo de Petición:**
```bash
curl -X GET "http://localhost:8080/api/weather/forecast?city=Cali&days=3&units=metric"
```

**Ejemplo de Respuesta:**
```json
{
  "status": "success",
  "data": {
    "location": {
      "city": "Cali",
      "country": "Colombia"
    },
    "forecast": [
      {
        "date": "2026-02-13",
        "temperature": {
          "min": 19,
          "max": 28,
          "avg": 23.5
        },
        "humidity": 75,
        "description": "Parcialmente nublado",
        "precipitation": 20,
        "wind_speed": 4.2
      },
      // ... más días
    ]
  }
}
```

### Clima por Coordenadas

**Endpoint:** `GET /api/weather/location`

**Query Parameters:**
- `lat` (float, required): Latitud
- `lon` (float, required): Longitud
- `units` (string, optional): Sistema de unidades

**Ejemplo:**
```bash
curl -X GET "http://localhost:8080/api/weather/location?lat=4.7110&lon=-74.0721&units=metric"
```

---

## 🔐 Autenticación y Seguridad

### API Keys

Algunas APIs requieren autenticación mediante API Key:

```bash
curl -X GET "http://localhost:8080/api/weather/current?city=Bogota" \
  -H "X-API-Key: tu_api_key_aqui"
```

### Rate Limiting

- **100 peticiones** por minuto por IP
- **1000 peticiones** diarias con API Key
- Headers de respuesta incluyen límites:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### CORS

CORS está configurado para permitir peticiones desde:
- `http://localhost:3000` (desarrollo)
- Dominios específicos en producción

---

## 🧪 Testing

### Tests del Backend (Go)

```bash
cd Wheater

# Ejecutar todos los tests
go test ./...

# Tests con cobertura
go test -cover ./...

# Tests con reporte detallado
go test -v -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Tests de integración
go test -tags=integration ./...

# Benchmark tests
go test -bench=. ./...
```

### Tests del Frontend (TypeScript)

```bash
cd client

# Ejecutar tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests E2E (si existen)
npm run test:e2e
```

---

## 🐳 Docker

### Ejecutar con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Dockerfile de Weather API

```dockerfile
# Build stage
FROM golang:1.19-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY Wheater/go.mod Wheater/go.sum ./
RUN go mod download

# Copiar código fuente
COPY Wheater/ ./

# Compilar aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o weather-api cmd/main.go

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copiar binario compilado
COPY --from=builder /app/weather-api .

EXPOSE 8080

CMD ["./weather-api"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  weather-api:
    build:
      context: .
      dockerfile: Wheater/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis
    networks:
      - api-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - api-network

  client:
    build:
      context: ./client
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://weather-api:8080/api
    depends_on:
      - weather-api
    networks:
      - api-network

networks:
  api-network:
    driver: bridge

volumes:
  redis-data:
```

---

## 📊 Monitoreo y Logging

### Health Check Endpoint

```bash
# Verificar estado de la API
curl http://localhost:8080/health

# Respuesta
{
  "status": "ok",
  "timestamp": "2026-02-13T14:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "external_api": "reachable"
  }
}
```

### Metrics Endpoint (Prometheus)

```bash
curl http://localhost:8080/metrics
```

### Logs

Los logs se generan en formato JSON:

```json
{
  "level": "info",
  "time": "2026-02-13T14:30:00Z",
  "message": "Request processed successfully",
  "method": "GET",
  "path": "/api/weather/current",
  "status": 200,
  "duration": "45ms",
  "ip": "192.168.1.1"
}
```

---

## 🚀 Despliegue en Producción

### Build de Producción

#### Backend:
```bash
cd Wheater

# Compilar para Linux (producción)
GOOS=linux GOARCH=amd64 go build -o weather-api cmd/main.go

# Optimizar binario
go build -ldflags="-s -w" -o weather-api cmd/main.go
```

#### Frontend:
```bash
cd client

# Build de producción
npm run build

# Los archivos estarán en /dist
```

### Variables de Entorno en Producción

```env
# Production settings
ENVIRONMENT=production
PORT=8080

# Security
JWT_SECRET=secret_super_seguro_aqui
API_KEY=production_api_key

# External Services
WEATHER_API_KEY=production_weather_key
REDIS_HOST=redis.production.com
REDIS_PASSWORD=secure_password

# Database
DB_HOST=db.production.com
DB_SSL_MODE=require

# CORS
ALLOWED_ORIGINS=https://tuapp.com,https://www.tuapp.com
```

---

## 📚 Próximas APIs

APIs planeadas para futuras versiones:

- 🔐 **Authentication API** - Servicio de autenticación y autorización
- 💱 **Currency Converter API** - Conversión de monedas en tiempo real
- 📧 **Email Service API** - Servicio de envío de emails
- 📱 **SMS API** - Envío de mensajes SMS
- 🗺️ **Geolocation API** - Servicios de geolocalización
- 📊 **Analytics API** - Recopilación y análisis de datos
- 🔍 **Search API** - Motor de búsqueda avanzado

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** (`git checkout -b feature/NuevaAPI`)
3. **Commit** tus cambios (`git commit -m 'feat: Add Currency API'`)
4. **Push** a la rama (`git push origin feature/NuevaAPI`)
5. Abre un **Pull Request**

### Guidelines para Contribuir

- ✅ Seguir las convenciones de código Go (gofmt, golint)
- ✅ Escribir tests para nuevas funcionalidades
- ✅ Documentar endpoints en formato OpenAPI/Swagger
- ✅ Actualizar README con nueva documentación
- ✅ Asegurar que todos los tests pasen antes de PR

### Convención de Commits

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Formato de código (no afecta funcionalidad)
refactor: Refactorización de código
test: Añadir o modificar tests
chore: Tareas de mantenimiento
perf: Mejoras de rendimiento
```

---

## 🐛 Reporte de Issues

¿Encontraste un bug? ¿Tienes una sugerencia?

1. Revisa [Issues existentes](https://github.com/hardostascon/Apis-Golang/issues)
2. [Crea un nuevo Issue](https://github.com/hardostascon/Apis-Golang/issues/new)

**Información a incluir:**
- Descripción detallada del problema
- Pasos para reproducir
- Versión de Go/Node.js
- Sistema operativo
- Logs relevantes
- Screenshots (si aplica)

---


## 📊 Estadísticas del Proyecto

![GitHub last commit](https://img.shields.io/github/last-commit/hardostascon/Apis-Golang)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/hardostascon/Apis-Golang)
![GitHub issues](https://img.shields.io/github/issues/hardostascon/Apis-Golang)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hardostascon/Apis-Golang)

**Lenguajes:**
- TypeScript: 76.2%
- Go: 22.8%
- JavaScript: 1.0%

---

## 🛡️ Seguridad

### Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor NO abras un issue público. 

En su lugar:
1. Envía un email a: security@hardostascon.com
2. Describe la vulnerabilidad en detalle
3. Espera una respuesta en 48 horas

### Buenas Prácticas Implementadas

- ✅ Validación de entrada en todos los endpoints
- ✅ Rate limiting para prevenir abuse
- ✅ CORS configurado apropiadamente
- ✅ Headers de seguridad (HSTS, CSP, etc.)
- ✅ Sanitización de datos
- ✅ Secrets nunca en código (usar variables de entorno)
- ✅ Dependencias actualizadas regularmente

---

## 📖 Recursos Adicionales

### Documentación
- [Documentación de Go](https://golang.org/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [RESTful API Guidelines](https://restfulapi.net/)

### Tutoriales
- [Building REST APIs with Go](https://golang.org/doc/articles/wiki/)
- [TypeScript for JavaScript Developers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## 👨‍💻 Autor

**hardostascon**

- GitHub: [@hardostascon](https://github.com/hardostascon)
- Email: hardos34@hotmail.com
- LinkedIn: [hardostascon](https://www.linkedin.com/in/hardostaz/)

---

## 🙏 Agradecimientos

- A la comunidad de Go por las excelentes librerías
- A los proveedores de APIs externas utilizadas
- A la comunidad open source

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

```
MIT License

Copyright (c) 2026 hardostascon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📞 Soporte y Contacto

¿Necesitas ayuda?

- 📧 **Email:** hardos34@hotmail.com
- 💼 **LinkedIn:** [Perfil profesional](https://www.linkedin.com/in/hardostaz/)

---

## ⭐ Proyecto Destacado

Si este proyecto te resulta útil:

- ⭐ Dale una estrella en GitHub
- 🍴 Haz un fork y contribuye
- 📢 Compártelo con otros desarrolladores
- 💬 Deja tus comentarios y sugerencias

---

<div align="center">

### 🚀 Desarrollado con pasión por la comunidad de desarrolladores

**[⬆ Volver arriba](#️-apis-golang---colección-de-apis-restful)**

---

**Última actualización:** Febrero 2026

</div>
