// APIRequestContext permite realizar solicitudes HTTP
// directamente desde Playwright.
import {
  APIRequestContext,
} from '@playwright/test';


/**
 * Deja TechStore en un estado conocido antes de cada test.
 *
 * Realiza dos tareas:
 *
 * 1. Desactiva el modo Bug Hunting.
 * 2. Reinicia productos, favoritos, carrito y pedidos.
 *
 * Esto evita que un test afecte al siguiente.
 */
export async function prepararEstadoLimpio(
  request: APIRequestContext
): Promise<void> {

  // -------------------------------------------------------
  // DESACTIVAR BUG HUNTING
  // -------------------------------------------------------

  const respuestaBugs =
    await request.post(
      '/api/config/bugs',
      {
        data: {
          enabled: false,
        },
      }
    );


  // Si el servidor no pudo cambiar el modo,
  // detenemos la prueba con un error descriptivo.
  if (!respuestaBugs.ok()) {
    throw new Error(
      `No se pudo desactivar Bug Hunting. Status: ${respuestaBugs.status()}`
    );
  }


  // -------------------------------------------------------
  // REINICIAR DATOS
  // -------------------------------------------------------

  const respuestaReset =
    await request.post(
      '/api/test/reset'
    );


  // Confirmamos que TechStore pudo
  // regresar al estado inicial.
  if (!respuestaReset.ok()) {
    throw new Error(
      `No se pudo reiniciar el estado de TechStore. Status: ${respuestaReset.status()}`
    );
  }
}