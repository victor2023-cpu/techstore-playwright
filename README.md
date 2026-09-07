# TechStore - Automatización de Pruebas con Playwright

Proyecto de automatización de pruebas desarrollado con **Playwright** y **TypeScript** para validar funcionalidades críticas de la aplicación TechStore.

El proyecto automatiza escenarios relacionados principalmente con:

- Carrito de compras.
- Cálculo de totales.
- Cantidades de productos.
- Eliminación de productos.
- Checkout.
- Confirmación de pedidos.
- Validación del carrito después de una compra.


## Objetivo

Automatizar Test Cases funcionales de TechStore para verificar que los principales flujos de compra funcionen correctamente en diferentes navegadores.

La automatización utiliza una arquitectura basada en **Page Object Model (POM)** para facilitar el mantenimiento y reutilización del código.


## Tecnologías utilizadas

- Playwright
- TypeScript
- Node.js
- npm
- Chromium
- Firefox


## Test Cases automatizados

Actualmente el proyecto contiene **10 Test Cases automatizados**.

### Carrito de compras

| Test Case | Descripción |
|---|---|
| TC-101 | Agregar un producto al carrito |
| TC-102 | Agregar múltiples productos diferentes |
| TC-110 | Validar que el total sea igual a la suma de los subtotales |
| TC-112 | Agregar varias veces el mismo producto e incrementar la cantidad |
| TC-113 | Eliminar un producto y actualizar el carrito |

### Checkout

| Test Case | Descripción |
|---|---|
| TC-119 | Comprar un producto |
| TC-120 | Comprar múltiples productos |
| TC-123 | Validar que el total confirmado coincida con el total del carrito |
| TC-130 | Validar número de pedido y total en la confirmación |
| TC-131 | Validar que el carrito quede vacío después de una compra exitosa |


## Navegadores

Los Test Cases se ejecutan en:

- Chromium
- Firefox

Por lo tanto:

```text
10 Test Cases × 2 navegadores = 20 ejecuciones
```


## Estructura del proyecto

```text
techstore-playwright/
│
├── data/
│   └── constantes.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── StorePage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── tests/
│   ├── cart.spec.ts
│   └── checkout.spec.ts
│
├── utils/
│   └── moneda.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

> El archivo `.env` se utiliza localmente y no debe subirse al repositorio.

---

## Page Object Model

El proyecto utiliza **Page Object Model** para separar la lógica de interacción con la aplicación de los Test Cases.

### LoginPage

Gestiona las acciones relacionadas con el inicio de sesión.

```text
pages/LoginPage.ts
```

### StorePage

Gestiona las acciones relacionadas con los productos de la tienda.

```text
pages/StorePage.ts
```

### CartPage

Gestiona acciones relacionadas con el carrito:

- Abrir carrito.
- Cerrar carrito.
- Vaciar carrito.
- Obtener productos.
- Obtener cantidades.
- Obtener subtotales.
- Obtener total.
- Eliminar productos.
- Finalizar compra.

```text
pages/CartPage.ts
```

### CheckoutPage

Gestiona las validaciones posteriores a una compra:

- Confirmación de pedido.
- Número de pedido.
- Total confirmado.

```text
pages/CheckoutPage.ts
```

---

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- Git

Comprobar las versiones:

```powershell
node --version

npm --version

git --version
```

---

## Instalación

Clonar el repositorio:

```powershell
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```powershell
cd techstore-playwright
```

Instalar las dependencias:

```powershell
npm install
```

Instalar los navegadores utilizados por Playwright:

```powershell
npx playwright install
```

---

## Variables de entorno

Crear un archivo:

```text
.env
```

en la raíz del proyecto.

Ejemplo:

```env
BASE_URL=http://localhost:3000

CUSTOMER_USERNAME=usuario_de_prueba
CUSTOMER_PASSWORD=password_de_prueba
```

Las credenciales reales no deben almacenarse directamente en el código ni subirse al repositorio.

---

## Ejecutar la aplicación

La aplicación TechStore debe estar disponible antes de ejecutar las pruebas.

En el entorno local utilizado para este proyecto:

```text
http://localhost:3000
```

---

## Validar TypeScript

Antes de ejecutar los tests se puede verificar que el proyecto no tenga errores de TypeScript:

```powershell
npx tsc --noEmit
```

Si no aparece ningún mensaje de error, la validación fue exitosa.

---

## Listar Test Cases

Para comprobar los tests disponibles sin ejecutarlos:

```powershell
npx playwright test --list
```

---

## Ejecutar todos los Test Cases

```powershell
npx playwright test
```

Esta ejecución utiliza los navegadores definidos en:

```text
playwright.config.ts
```


## Ejecutar solamente Carrito

```powershell
npx playwright test tests/cart.spec.ts
```

## Ejecutar solamente Checkout

```powershell
npx playwright test tests/checkout.spec.ts
```

## Ejecutar solamente Chromium

```powershell
npx playwright test --project=chromium
```

## Ejecutar solamente Firefox

```powershell
npx playwright test --project=firefox
```

## Ejecutar un Test Case específico

Ejemplo con TC-110:

```powershell
npx playwright test -g "TC-110"
```

En Chromium:

```powershell
npx playwright test -g "TC-110" --project=chromium
```

## Ejecutar mostrando el navegador

Para observar visualmente la automatización:

```powershell
npx playwright test --headed
```

## Reporte HTML

Después de ejecutar los tests, Playwright genera un reporte HTML.

Para abrirlo:

```powershell
npx playwright show-report
```

El reporte permite consultar:

- Tests aprobados.
- Tests fallidos.
- Tiempo de ejecución.
- Screenshots de errores.
- Videos.
- Trace de Playwright.


## Estrategia de estabilidad

Actualmente los tests utilizan:

```text
workers: 1
```

Esto permite ejecutar las pruebas secuencialmente y evita interferencias cuando diferentes Test Cases utilizan el mismo usuario y el mismo carrito.

Los tests también limpian el carrito antes de cada ejecución para garantizar un estado inicial conocido.


## Buenas prácticas aplicadas

El proyecto aplica prácticas como:

- Page Object Model.
- Reutilización de código.
- Separación entre tests, páginas, datos y utilidades.
- Uso de variables de entorno.
- Uso de `data-testid`.
- Test Cases independientes.
- Limpieza del estado antes de cada prueba.
- Assertions explícitas.
- Esperas automáticas de Playwright.
- Evitar `page.waitForTimeout()`.
- Ejecución cross-browser.

## Estado del proyecto

```text
Carrito
TC-101 ✅
TC-102 ✅
TC-110 ✅
TC-112 ✅
TC-113 ✅

Checkout
TC-119 ✅
TC-120 ✅
TC-123 ✅
TC-130 ✅
TC-131 ✅
```

Suite automatizada:

```text
10 Test Cases
2 navegadores
20 ejecuciones
```

---

## Autor

Proyecto de automatización QA desarrollado como parte de la implementación de pruebas funcionales para TechStore, en el diplomado de DIPLOMADO EN QA Y GESTIÓN DE CALIDAD DE SOFTWARE en la materia de Automatización de Pruebas con el Ing. Frank Sejas