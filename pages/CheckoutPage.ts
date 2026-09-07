// Importamos las herramientas necesarias de Playwright.
//
// expect:
// Permite realizar validaciones con espera automática.
//
// Locator:
// Representa un elemento localizado en la interfaz.
//
// Page:
// Representa la pestaña actual del navegador.
import {
  expect,
  Locator,
  Page,
} from '@playwright/test';


// Importamos nuestra utilidad para convertir
// valores como "$4096.99" a números.
import {
  convertirMonedaANumero,
} from '../utils/moneda';


export class CheckoutPage {

  // =========================================================
  // LOCATORS
  // =========================================================

  // Mensaje mostrado después de completar
  // correctamente una compra.
  //
  // Ejemplo:
  //
  // ¡Pedido #25 confirmado! Total: $4096.99
  readonly confirmacionPedido: Locator;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly page: Page
  ) {

    // Localizamos la confirmación utilizando
    // la parte estable de su contenido.
    //
    // El número del pedido y el total son dinámicos.
    //
    // Ejemplos que puede encontrar:
    //
    // ¡Pedido #1 confirmado! Total: $1299.00
    // ¡Pedido #27 confirmado! Total: $4096.99
    this.confirmacionPedido =
      page
        .getByText(
          /Pedido #\d+ confirmado!\s*Total:\s*\$/i
        )
        .first();
  }


  // =========================================================
  // ESPERAR CONFIRMACIÓN
  // =========================================================

  /**
   * Espera hasta que TechStore muestre
   * la confirmación de una compra exitosa.
   */
  async esperarConfirmacion(): Promise<void> {

    await expect(
      this.confirmacionPedido
    ).toBeVisible({
      timeout: 10_000,
    });
  }


  // =========================================================
  // OBTENER TEXTO COMPLETO
  // =========================================================

  /**
   * Obtiene el texto completo de la confirmación.
   *
   * Ejemplo:
   *
   * ¡Pedido #25 confirmado! Total: $4096.99
   */
  async obtenerTextoConfirmacion(): Promise<string> {

    // Primero esperamos a que la confirmación aparezca.
    await this.esperarConfirmacion();


    // innerText devuelve el texto visible
    // mostrado al usuario.
    const texto =
      await this.confirmacionPedido.innerText();


    // Eliminamos espacios innecesarios al inicio
    // o al final del mensaje.
    return texto.trim();
  }


  // =========================================================
  // OBTENER TOTAL CONFIRMADO
  // =========================================================

  /**
   * Extrae el total del mensaje de confirmación.
   *
   * Ejemplo:
   *
   * Texto:
   * ¡Pedido #25 confirmado! Total: $4096.99
   *
   * Resultado:
   * 4096.99
   */
  async obtenerTotalConfirmado(): Promise<number> {

    // Obtenemos el mensaje completo.
    const texto =
      await this.obtenerTextoConfirmacion();


    // Buscamos el valor monetario
    // que aparece después de "Total:".
    //
    // Admite:
    //
    // $4096.99
    // $4,096.99
    const coincidencia =
      texto.match(
        /Total:\s*(\$[\d,]+(?:\.\d{2})?)/i
      );


    // Si no encontramos el total,
    // detenemos el test con un mensaje claro.
    if (!coincidencia) {
      throw new Error(
        `No fue posible obtener el total de la confirmación: "${texto}"`
      );
    }


    // Convertimos el valor monetario
    // desde texto a número.
    return convertirMonedaANumero(
      coincidencia[1]
    );
  }


  // =========================================================
  // OBTENER NÚMERO DE PEDIDO
  // =========================================================

  /**
   * Extrae el número de pedido.
   *
   * Ejemplo:
   *
   * Texto:
   * ¡Pedido #25 confirmado!
   *
   * Resultado:
   * 25
   */
  async obtenerNumeroPedido(): Promise<number> {

    // Obtenemos la confirmación completa.
    const texto =
      await this.obtenerTextoConfirmacion();


    // Buscamos los dígitos situados
    // después de "Pedido #".
    const coincidencia =
      texto.match(
        /Pedido #(\d+)/i
      );


    // Si no existe un número de pedido,
    // el comportamiento no es válido.
    if (!coincidencia) {
      throw new Error(
        `No fue posible obtener el número de pedido: "${texto}"`
      );
    }


    // Convertimos el número desde string a number.
    return Number(
      coincidencia[1]
    );
  }
}