# PipelineCraft-R3 🚀

Arquitectura de pruebas automatizadas con Playwright, Cucumber y patrón Screenplay, integrada con CI/CD en GitHub Actions.

## 📋 Descripción

Este proyecto implementa una arquitectura completa de pruebas automatizadas que combina:
- **Pruebas E2E (End-to-End)** en SauceDemo usando Playwright
- **Pruebas de API** en DummyJSON usando Playwright API Testing
- **BDD (Behavior Driven Development)** con Cucumber y Gherkin
- **Patrón Screenplay** para arquitectura limpia y mantenible
- **CI/CD** con GitHub Actions

## 🛠️ Tecnologías Utilizadas

- **[Playwright](https://playwright.dev/)** - Framework de automatización para pruebas E2E y API
- **[Cucumber](https://cucumber.io/)** - Framework BDD con Gherkin
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje de programación tipado
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **Node.js 18+** - Entorno de ejecución

## 📁 Estructura del Proyecto

```
PipelineCraft-R3/
├── .github/
│   └── workflows/
│       └── run-tests.yml          # GitHub Actions workflow
├── screenplay/
│   ├── actors/                     # Actores del patrón Screenplay
│   │   ├── Actor.ts               # Clase base
│   │   ├── ShopperActor.ts        # Actor para E2E
│   │   └── ApiUserActor.ts        # Actor para API
│   ├── tasks/                      # Tareas de negocio
│   │   ├── Login.ts
│   │   ├── AddToCart.ts
│   │   ├── Checkout.ts
│   │   ├── AuthenticateUser.ts
│   │   ├── GetProducts.ts
│   │   └── ManageCart.ts
│   ├── questions/                  # Validaciones
│   │   ├── ApiResponse.ts
│   │   └── PageElement.ts
│   └── interactions/               # Interacciones atómicas
│       ├── Click.ts
│       ├── Fill.ts
│       ├── Navigate.ts
│       ├── Wait.ts
│       └── ApiRequest.ts
├── tests/
│   ├── e2e/
│   │   ├── features/              # Archivos .feature (Gherkin)
│   │   │   ├── purchase-flow.feature
│   │   │   ├── login-failed.feature
│   │   │   └── product-sorting.feature
│   │   ├── step-definitions/      # Step definitions de Cucumber
│   │   │   └── common.steps.ts
│   │   └── pages/                 # Page Objects
│   │       ├── LoginPage.ts
│   │       ├── ProductsPage.ts
│   │       ├── CartPage.ts
│   │       └── CheckoutPage.ts
│   ├── api/                        # Pruebas de API
│   │   ├── auth.spec.ts           # Autenticación
│   │   ├── products.spec.ts       # Productos
│   │   ├── contract.spec.ts       # Pruebas de contrato
│   │   └── e2e-flow.spec.ts       # Flujo completo
│   └── utils/
│       ├── apiHelper.ts           # Utilidades para API
│       └── generatePdfReport.ts   # Generador de reportes PDF
├── reports/                        # Reportes de ejecución
├── .env                           # Variables de entorno
├── .env.example                   # Template de variables
├── config.yml                     # Configuración global
├── playwright.config.ts           # Configuración de Playwright
├── cucumber.js                    # Configuración de Cucumber
├── package.json                   # Dependencias del proyecto
└── README.md                      # Este archivo
```

## 🎯 Escenarios Cubiertos

### Pruebas E2E (SauceDemo)

#### 1. **Flujo de Compra Exitoso** (Happy Path)
- Login con credenciales válidas
- Selección de productos
- Agregar al carrito
- Proceso de checkout
- Confirmación de orden

#### 2. **Escenarios de Login Fallido** (Negative Testing)
- Credenciales inválidas
- Usuario bloqueado
- Campos vacíos

#### 3. **Ordenamiento de Productos**
- Por nombre (A-Z, Z-A)
- Por precio (menor a mayor, mayor a menor)

### Pruebas de API (DummyJSON)

#### 1. **Autenticación**
- `POST /auth/login` - Login exitoso y fallido
- `GET /auth/me` - Obtener usuario autenticado
- `POST /auth/refresh` - Refrescar token

#### 2. **Productos**
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto por ID
- `GET /products/search` - Buscar productos
- `GET /products/categories` - Listar categorías
- `POST /products/add` - Agregar producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

#### 3. **Carrito de Compras**
- `POST /carts/add` - Crear carrito
- `GET /carts/:id` - Obtener carrito
- `PUT /carts/:id` - Actualizar carrito
- `DELETE /carts/:id` - Eliminar carrito

#### 4. **Pruebas de Contrato**
- Validación de schemas JSON
- Validación de tipos de datos
- Validación de formatos (email, URL, JWT)

#### 5. **Flujo E2E Completo**
- Login → Listar productos → Crear carrito → Actualizar → Eliminar

## 🚀 Instalación

### Prerrequisitos

- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/willkwolf/PipelineCraft-R3.git
cd PipelineCraft-R3
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Instalar navegadores de Playwright**

```bash
npx playwright install
```

4. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

El archivo `.env` ya contiene las configuraciones necesarias:

```env
# E2E Tests - SauceDemo
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
PASSWORD=secret_sauce

# API Tests - DummyJSON
API_URL=https://dummyjson.com
API_USERNAME=emilys
API_PASSWORD=emilyspass
```

## ▶️ Ejecución de Pruebas

### Ejecución Local

#### Ejecutar todas las pruebas

```bash
npm test
```

#### Ejecutar solo pruebas E2E

```bash
npm run test:e2e
```

#### Ejecutar solo pruebas de API

```bash
npm run test:api
```

#### Ejecutar pruebas con interfaz (headed mode)

```bash
npm run test:ui
```

#### Ver reporte de Playwright

```bash
npm run test:report
```

#### Generar reporte PDF

```bash
npm run generate:pdf
```

### Ejecución en CI/CD

El proyecto está configurado con GitHub Actions. Las pruebas se ejecutan automáticamente en:

- **Push** a las ramas `main` o `master`
- **Pull Requests** a las ramas `main` o `master`
- **Manualmente** mediante workflow_dispatch

Para ejecutar manualmente:

1. Ve a **Actions** en GitHub
2. Selecciona **Run Tests**
3. Haz clic en **Run workflow**

## 📊 Reportes

Los reportes se generan en la carpeta `/reports`:

- **HTML**: `reports/playwright-report/`
- **JSON**: `reports/playwright-results.json`
- **JUnit**: `reports/junit-results.xml`
- **Cucumber**: `reports/cucumber-report.html`
- **PDF**: `reports/test-report.pdf`

En GitHub Actions, los reportes están disponibles como **artifacts** después de cada ejecución.

## 🎭 Patrón Screenplay

Este proyecto implementa el patrón Screenplay para mejor organización y mantenibilidad:

### Componentes

- **Actors** (Actores): Representan usuarios que interactúan con el sistema
  - `ShopperActor`: Para pruebas E2E
  - `ApiUserActor`: Para pruebas de API

- **Tasks** (Tareas): Acciones de negocio de alto nivel
  - `Login`, `AddToCart`, `Checkout`
  - `AuthenticateUser`, `GetProducts`, `ManageCart`

- **Interactions** (Interacciones): Acciones atómicas
  - `Click`, `Fill`, `Navigate`, `Wait`
  - `ApiRequest`

- **Questions** (Preguntas): Validaciones y aserciones
  - `ApiResponse`, `PageElement`

### Ejemplo de Uso

```typescript
// E2E Test
await actor.attemptsTo(
  Login.asStandardUser(),
  AddToCart.product("Sauce Labs Backpack"),
  Checkout.withInformation("John", "Doe", "12345")
);

// API Test
await apiActor.attemptsTo(
  AuthenticateUser.asDefaultUser(),
  GetProducts.all().withLimit(10),
  ManageCart.create().withProducts({ id: 1, quantity: 2 })
);

const status = await apiActor.asks(ApiResponse.status());
expect(status).toBe(200);
```

## 👥 Colaboradores

- **Usuario con permisos de ejecución**: `michaelpena2404`

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm test` | Ejecuta todas las pruebas (E2E + API) |
| `npm run test:e2e` | Ejecuta solo pruebas E2E con Cucumber |
| `npm run test:api` | Ejecuta solo pruebas de API con Playwright |
| `npm run test:ui` | Ejecuta pruebas en modo headed (con navegador visible) |
| `npm run test:report` | Muestra el reporte HTML de Playwright |
| `npm run generate:pdf` | Genera reporte en formato PDF |
| `npm run install:browsers` | Instala navegadores de Playwright |

## 🔧 Configuración

### Playwright (`playwright.config.ts`)

- Navegadores: Chromium, Firefox, WebKit
- Reportes: HTML, JSON, JUnit
- Screenshots: Solo en fallos
- Videos: Solo en fallos
- Traces: Solo en fallos

### Cucumber (`cucumber.js`)

- Formatos: HTML, JSON, JUnit
- Retry: 1 intento
- Paralelismo: 2 workers
- Tags: Soporte para `@smoke`, `@regression`, `@skip`

## 🌐 URLs de Prueba

- **E2E Application**: https://www.saucedemo.com
- **API Endpoint**: https://dummyjson.com
- **Repository**: https://github.com/willkwolf/PipelineCraft-R3

## 📚 Documentación Adicional

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [DummyJSON API Docs](https://dummyjson.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de QA Automation.

---

**Generado con ❤️ por el equipo de PipelineCraft-R3**
