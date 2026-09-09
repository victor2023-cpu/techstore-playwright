// Carga automáticamente las variables definidas en .env.
import 'dotenv/config';

// Importamos la configuración principal de Playwright
// y los perfiles de dispositivos/navegadores.
import {
  defineConfig,
  devices,
} from '@playwright/test';


export default defineConfig({

  // ---------------------------------------------------------
  // UBICACIÓN DE LOS TEST CASES
  // ---------------------------------------------------------
  //
  // Playwright buscará los archivos .spec.ts
  // dentro de la carpeta tests.
  testDir: './tests',


  // ---------------------------------------------------------
  // PARALELISMO
  // ---------------------------------------------------------
  //
  // Dejamos la ejecución secuencial porque TechStore
  // comparte estado entre carrito, productos y usuarios.
  fullyParallel: false,

  workers: 1,


  // ---------------------------------------------------------
  // REINTENTOS
  // ---------------------------------------------------------
  //
  // Por ahora no reintentamos automáticamente.
  // Si un test falla queremos detectar el fallo real.
  retries: 0,


  // ---------------------------------------------------------
  // REPORTES
  // ---------------------------------------------------------
  //
  // Conservamos el reporte HTML nativo de Playwright
  // y agregamos Allure como segundo reporter.
  reporter: [

    // Reporte HTML tradicional de Playwright.
    [
      'html',
      {
        // Evita que se abra automáticamente
        // al finalizar cada ejecución.
        open: 'never',
      },
    ],

    // Reporte Allure.
    [
      'allure-playwright',
      {
        // Los datos intermedios utilizados para construir
        // el reporte se guardarán aquí.
        resultsDir: 'allure-results',

        // Incluye más detalle de hooks y acciones.
        detail: true,

        // Usa la estructura de suites de nuestros tests.
        suiteTitle: true,
      },
    ],
  ],


  // ---------------------------------------------------------
  // CONFIGURACIÓN GENERAL
  // ---------------------------------------------------------
  use: {

    // URL base tomada del archivo .env.
    baseURL:
      process.env.BASE_URL ??
      'http://localhost:3000',


    // Guarda trace cuando una prueba falla.
    // Allure puede reconocer el trace generado
    // por Playwright y adjuntarlo al reporte.
    trace: 'retain-on-failure',


    // Captura screenshot solamente cuando falla.
    screenshot: 'only-on-failure',


    // Conserva video cuando falla.
    video: 'retain-on-failure',
  },


  // ---------------------------------------------------------
  // NAVEGADORES
  // ---------------------------------------------------------
  projects: [

    // Google Chrome / Chromium.
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },


    // Mozilla Firefox.
    {
      name: 'firefox',

      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],
});