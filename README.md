# PipelineCraft-R3

## Abstract

Proyecto académico de automatización de pruebas que implementa una arquitectura completa de CI/CD utilizando el patrón de diseño Screenplay. El ejercicio integra Playwright para pruebas E2E y API, Cucumber con Gherkin para especificaciones BDD, y TypeScript como lenguaje principal. Se desarrolló un workflow de despliegue continuo en GitHub Actions, utilizando asistencia de IA (Claude Code) para validar el scripting de TypeScript y debuggear errores en los pipelines. Los escenarios E2E implementados en SauceDemo fueron replicados a nivel de API utilizando DummyJSON, consolidando aprendizajes sobre el patrón Screenplay y arquitecturas limpias de testing.

## Stack Tecnológico

- **Playwright** - Framework de automatización E2E y API Testing
- **Cucumber + Gherkin** - Especificaciones BDD
- **TypeScript** - Lenguaje de programación tipado
- **GitHub Actions** - CI/CD Pipeline
- **Node.js 18+** - Runtime
- **Claude Code** - Asistente IA para validación y debugging

## Arquitectura - Patrón Screenplay

El patrón Screenplay estructura las pruebas en capas de responsabilidad:

- **Actors**: Representan usuarios del sistema (`ShopperActor`, `ApiUserActor`)
- **Tasks**: Acciones de negocio de alto nivel (`Login`, `Checkout`, `AuthenticateUser`)
- **Interactions**: Operaciones atómicas (`Click`, `Fill`, `ApiRequest`)
- **Questions**: Validaciones y aserciones (`ApiResponse`, `PageElement`)

Esta arquitectura promueve código reutilizable, mantenible y expresivo.

## Escenarios de Prueba

### E2E (SauceDemo)
1. **Flujo de compra exitoso** - Login, selección de productos, checkout y confirmación
2. **Login fallido** - Validación de credenciales inválidas, usuario bloqueado, campos vacíos
3. **Ordenamiento de productos** - Por nombre y precio

### API (DummyJSON)
Los escenarios E2E fueron replicados a nivel de API, cubriendo:
- **Autenticación**: Login, refresh token, obtener usuario autenticado
- **Productos**: CRUD completo, búsqueda, categorías
- **Carrito**: Crear, actualizar, eliminar, consultar carritos
- **Contract Testing**: Validación de schemas, tipos de datos, formatos (email, URL, JWT)
- **Flujo E2E**: Login → Productos → Carrito → Actualización → Eliminación

**Total:** 24 pruebas API + 10 escenarios E2E

## Instalación

### Prerrequisitos
- Node.js 18+
- npm (incluido con Node.js)
- Git

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/willkwolf/PipelineCraft-R3.git
cd PipelineCraft-R3

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores
npx playwright install

# 4. Configurar variables de entorno (opcional)
cp .env.example .env
```

El archivo `.env` incluye configuraciones por defecto:
```env
BASE_URL=https://www.saucedemo.com
API_URL=https://dummyjson.com
USERNAME=standard_user
PASSWORD=secret_sauce
API_USERNAME=emilys
API_PASSWORD=emilyspass
```

## Ejecución

```bash
# Todas las pruebas (E2E + API)
npm test

# Solo E2E (Cucumber)
npm run test:e2e

# Solo API (Playwright)
npm run test:api

# Con interfaz gráfica
npm run test:ui

# Ver reporte HTML
npm run test:report

# Generar PDF
npm run generate:pdf
```

## CI/CD - GitHub Actions

El workflow se ejecuta automáticamente en:
- Push a `main` o `master`
- Pull Requests
- Manualmente desde la pestaña Actions

**Artifacts generados:**
- `playwright-report`: Resultados de pruebas API (HTML)
- `cucumber-reports`: Resultados de pruebas E2E (HTML, JSON, JUnit)

Para ejecutar manualmente: **Actions** → **Run Tests** → **Run workflow**

## Reportes

Los reportes se generan en `/reports`:

| Tipo | Ubicación |
|------|-----------|
| Playwright HTML | `playwright-report/index.html` |
| Cucumber HTML | `reports/cucumber-report.html` |
| Cucumber JSON | `reports/cucumber-report.json` |
| JUnit XML | `reports/cucumber-junit.xml` |
| PDF | `reports/test-report.pdf` |

En GitHub Actions, los reportes están disponibles como **artifacts** al finalizar cada ejecución.

## Estructura del Proyecto

```
PipelineCraft-R3/
├── .github/workflows/          # GitHub Actions
├── screenplay/                 # Patrón Screenplay
│   ├── actors/                 # Actores
│   ├── tasks/                  # Tareas de negocio
│   ├── interactions/           # Interacciones atómicas
│   └── questions/              # Validaciones
├── tests/
│   ├── e2e/                    # Pruebas E2E (Cucumber)
│   │   ├── features/           # Archivos .feature (Gherkin)
│   │   ├── step-definitions/   # Step definitions
│   │   └── pages/              # Page Objects
│   ├── api/                    # Pruebas API (Playwright)
│   └── utils/                  # Utilidades (apiHelper, apiConfig)
├── reports/                    # Reportes generados
├── playwright.config.ts        # Configuración Playwright
├── cucumber.js                 # Configuración Cucumber
└── package.json                # Dependencias
```

## Aprendizajes Clave

- **Patrón Screenplay**: Arquitectura escalable y mantenible para automatización
- **BDD con Cucumber**: Especificaciones legibles para stakeholders no técnicos
- **API Testing**: Contract testing y validación de flujos sin UI
- **CI/CD**: Automatización completa del pipeline de pruebas
- **Debugging con IA**: Optimización del desarrollo mediante asistencia inteligente
- **Cross-platform Testing**: Ejecución en múltiples navegadores (Chromium, Firefox, WebKit)

## Recursos

- **Repository**: https://github.com/willkwolf/PipelineCraft-R3
- **E2E App**: https://www.saucedemo.com
- **API Endpoint**: https://dummyjson.com
- **Documentación**: [Playwright](https://playwright.dev) | [Cucumber](https://cucumber.io) | [DummyJSON](https://dummyjson.com/docs)

---

**Desarrollado como ejercicio académico de QA Automation**
