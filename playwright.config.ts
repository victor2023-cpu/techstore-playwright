// Carga automáticamente las variables del archivo .env.
// Ejemplo: BASE_URL, CUSTOMER_USERNAME, CUSTOMER_PASSWORD.
import 'dotenv/config';

// Importa las herramientas necesarias para configurar Playwright.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Carpeta donde se encuentran nuestros archivos *.spec.ts.
  testDir: './tests',

  // Desactivamos el paralelismo total porque actualmente
  // Chromium y Firefox utilizan el mismo usuario Customer
  // y podrían modificar el mismo carrito simultáneamente.
  fullyParallel: false,

  // Ejecutamos una prueba a la vez para evitar
  // interferencias entre los datos de los tests.
  workers: 1,

  // Mientras desarrollamos no hacemos reintentos automáticos.
  // Si un test falla queremos detectar el problema inmediatamente.
  retries: 0,

  // Genera un reporte HTML con los resultados.
  //
  // Para abrirlo:
  // npx playwright show-report
  reporter: 'html',

  // Configuración compartida por todos los navegadores.
  use: {

    // Lee BASE_URL desde el archivo .env.
    //
    // Si BASE_URL no existe, usa localhost:3000.
    baseURL:
      process.env.BASE_URL ?? 'http://localhost:3000',

    // Conserva el trace solamente cuando falla un test.
    // Sirve para investigar paso a paso lo ocurrido.
    trace: 'retain-on-failure',

    // Guarda captura de pantalla cuando falla un test.
    screenshot: 'only-on-failure',

    // Guarda video cuando falla un test.
    video: 'retain-on-failure',
  },

  // Navegadores donde ejecutaremos los tests.
  projects: [

    {
      // Ejecución utilizando Chromium.
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      // Ejecución utilizando Firefox.
      name: 'firefox',

      use: {
        ...devices['Desktop Firefox'],
      },
    },

  ],

});