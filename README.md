# PipelineCraft-R3

## Abstract

Proyecto académico de automatización de pruebas que implementa una arquitectura completa de CI/CD utilizando el patrón de diseño Screenplay. El ejercicio integra Playwright para pruebas E2E y API, Cucumber con Gherkin para especificaciones BDD, y TypeScript como lenguaje principal. Se desarrolló un workflow de despliegue continuo en GitHub Actions, utilizando asistencia de IA (Claude Code) para validar el scripting de TypeScript y debuggear errores en los pipelines. Los escenarios E2E implementados en SauceDemo fueron replicados a nivel de API utilizando DummyJSON, consolidando aprendizajes sobre el patrón Screenplay y arquitecturas limpias de testing.

## Herramientas Utilizadas

- **Playwright** - Framework de automatización E2E y API Testing
- **Cucumber + Gherkin** - Especificaciones BDD (Behavior Driven Development)
- **TypeScript** - Lenguaje de programación tipado
- **GitHub Actions** - CI/CD Pipeline
- **Node.js 18+** - Runtime de ejecución
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

## Cómo Correr las Pruebas

### Opción 1: Ejecución Local

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

### Opción 2: Ejecución desde GitHub Actions

#### Si tienes acceso Write al repositorio:
1. Ve a la pestaña **Actions** del repositorio
2. Selecciona el workflow **Run Tests**
3. Haz clic en **Run workflow**
4. Selecciona la rama (por defecto `main`)
5. Haz clic en el botón verde **Run workflow**

#### Si tienes acceso Read (colaboradores):
1. Crea un **Pull Request** con cualquier cambio (puede ser mínimo, como agregar un espacio)
2. El workflow se ejecuta **automáticamente** al crear/actualizar el PR
3. Ve a la pestaña **Checks** del Pull Request para monitorear la ejecución
4. Al finalizar, descarga los **artifacts** (reportes) desde la página del workflow
5. Los reportes estarán disponibles durante 30 días

**Nota:** No es necesario hacer fork del repositorio, solo crear un PR desde una rama.

## CI/CD - GitHub Actions

El workflow configurado en [.github/workflows/run-tests.yml](.github/workflows/run-tests.yml) se ejecuta automáticamente en:

- **Push** a las ramas `main` o `master`
- **Pull Requests** hacia `main` o `master`
- **Manualmente** mediante `workflow_dispatch` (requiere acceso Write)

### Artifacts Generados

Después de cada ejecución, se generan 2 artifacts disponibles para descarga:

| Artifact | Contenido | Formato |
|----------|-----------|---------|
| `playwright-report` | Resultados de pruebas API | HTML interactivo |
| `cucumber-reports` | Resultados de pruebas E2E | HTML, JSON, JUnit |

**Retención:** 30 días

### Cómo Descargar Artifacts desde un Pull Request

1. Abre el Pull Request
2. Ve a la pestaña **Checks** (o **Details** del workflow)
3. Haz scroll hasta el final de la página del workflow
4. En la sección **Artifacts**, descarga los reportes deseados
5. Extrae los archivos ZIP y abre los HTML en tu navegador

## Reportes

Los reportes se generan localmente en la carpeta `/reports`:

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
