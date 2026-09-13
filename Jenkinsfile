// ==========================================================
// JENKINSFILE - TECHSTORE QA
// ==========================================================
//
// Este archivo define el proceso de Integración Continua (CI)
// del proyecto TechStore.
//
// Flujo:
// 1. Descargar código desde GitHub.
// 2. Instalar dependencias.
// 3. Instalar navegadores de Playwright.
// 4. Verificar que TechStore esté disponible.
// 5. Limpiar resultados anteriores de Allure.
// 6. Ejecutar pruebas API con Newman.
// 7. Ejecutar pruebas UI/E2E con Playwright.
// 8. Publicar el reporte integrado en Allure.
// ==========================================================

pipeline {

    // Jenkins ejecutará el pipeline en el agente disponible.
    agent any

    // ======================================================
    // VARIABLES DE ENTORNO
    // ======================================================
    //
    // Estas variables quedan disponibles para Playwright
    // y para los comandos ejecutados por Jenkins.
    environment {

        BASE_URL = 'http://localhost:3000'

        ADMIN_USERNAME = 'admin'
        ADMIN_PASSWORD = 'admin123'

        CUSTOMER_USERNAME = 'customer'
        CUSTOMER_PASSWORD = 'customer123'
    }

    stages {

        // ==================================================
        // 1. DESCARGAR CÓDIGO
        // ==================================================
        stage('Checkout') {

            steps {

                // Descarga desde GitHub el código asociado
                // al repositorio configurado en Jenkins.
                checkout scm
            }
        }

        // ==================================================
        // 2. INSTALAR DEPENDENCIAS
        // ==================================================
        stage('Instalar dependencias') {

            steps {

                // npm ci utiliza exactamente las versiones
                // registradas en package-lock.json.
                bat 'call npm ci'
            }
        }

        // ==================================================
        // 3. INSTALAR NAVEGADORES PLAYWRIGHT
        // ==================================================
        stage('Instalar navegadores') {

            steps {

                // Instala Chromium y Firefox,
                // que son los navegadores usados por el proyecto.
                bat 'call npx playwright install chromium firefox'
            }
        }

        // ==================================================
        // 4. VERIFICAR TECHSTORE
        // ==================================================
        stage('Verificar TechStore') {

            steps {

                // Consulta el endpoint de Health Check.
                // Si TechStore no responde HTTP 200,
                // Jenkins marcará el Pipeline como fallido.
                bat '''
                    @echo off

                    powershell -NoProfile -Command ^
                    "$response = Invoke-WebRequest -UseBasicParsing -Uri '%BASE_URL%/api/health'; ^
                    if ($response.StatusCode -ne 200) { exit 1 }; ^
                    Write-Host 'TechStore disponible - HTTP' $response.StatusCode"
                '''
            }
        }

        // ==================================================
        // 5. LIMPIAR RESULTADOS ALLURE
        // ==================================================
        stage('Limpiar Allure') {

            steps {

                // Elimina resultados de ejecuciones anteriores
                // para evitar duplicados en el reporte.
                bat 'call npm run allure:clean'
            }
        }

        // ==================================================
        // 6. PRUEBAS API
        // ==================================================
        stage('Pruebas API') {

            steps {

                // Ejecuta las 17 requests de Postman con Newman.
                //
                // El reporter de Newman también escribe
                // resultados dentro de allure-results.
                bat 'call npm run test:api'
            }
        }

        // ==================================================
        // 7. PRUEBAS UI / E2E
        // ==================================================
        stage('Pruebas Playwright') {

            steps {

                // Ejecuta los 19 Test Cases en:
                //
                // Chromium = 19
                // Firefox  = 19
                //
                // Total Playwright = 38 ejecuciones.
                bat 'call npm run test'
            }
        }

        // ==================================================
        // 8. GENERAR REPORTE ALLURE
        // ==================================================
        stage('Generar Allure') {

            steps {

                // Genera un único reporte utilizando los
                // resultados de Newman + Playwright.
                bat 'call npm run allure:generate'
            }
        }
    }

    // ======================================================
    // ACCIONES POSTERIORES
    // ======================================================
    //
    // Esta sección se ejecuta incluso si alguna prueba falla.
    post {

        always {

            // Publica los resultados en Jenkins mediante
            // el plugin de Allure que ya tenemos instalado.
            allure(
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            )
        }
    }
}