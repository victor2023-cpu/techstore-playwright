// Importamos las herramientas de Playwright.
// expect:
// Permite hacer validaciones con espera automática.
// Locator:
// Representa un elemento localizado en la página.
// Page:
// Representa la pestaña actual del navegador.
import {expect, Locator, Page,} from '@playwright/test';

export class CartPage {

  // =========================================================
  // LOCATORS PRINCIPALES
  // =========================================================

  // Botón que abre el carrito.
  readonly botonCarrito: Locator;

  // Panel lateral del carrito.
  readonly panel: Locator;

  // Fondo que aparece detrás del carrito cuando está abierto.
  readonly overlay: Locator;

  // Todos los productos existentes actualmente en el carrito.
  readonly items: Locator;

  // Todos los subtotales de los productos.
  readonly subtotales: Locator;

  // Total general del carrito.
  readonly total: Locator;

  // Botón utilizado para finalizar la compra.
  readonly botonCheckout: Locator;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly page: Page
  ) {

    // Botón utilizado para abrir el carrito.
    this.botonCarrito =
      page.getByTestId('cart-toggle');


    // Panel lateral completo del carrito.
    this.panel =
      page.getByTestId('cart-panel');


    // Fondo exterior del carrito.
    this.overlay =
      page.getByTestId('cart-overlay');


    // Contenedores principales de productos.
    //
    // data-product-id nos permite evitar elementos internos
    // como cart-item-name, cart-item-quantity, etc.
   // Localiza únicamente las filas principales de productos
// que están dentro del contenedor cart-items.
//
// Usamos "li" porque cada producto del carrito está
// representado por un elemento <li>.
//
// Esto evita contar elementos internos del producto
// como nombre, cantidad o subtotal.
this.items = page
  .getByTestId('cart-items')
  .locator(
    'li[data-testid^="cart-item-"][data-product-id]'
  );


    // Todos los subtotales visibles dentro del carrito.
    this.subtotales =
      page.getByTestId('cart-item-subtotal');


    // Total general del carrito.
    this.total =
      page.getByTestId('cart-total');


    // Botón Finalizar compra.
    this.botonCheckout =
      page.getByTestId('checkout-button');
  }


  // =========================================================
  // COMPROBAR ESTADO DEL CARRITO
  // =========================================================

  /**
   * Comprueba si el panel del carrito está visible.
   *
   * Utilizamos visibilidad en lugar de depender
   * directamente de una clase CSS como "open".
   */
  async estaAbierto(): Promise<boolean> {

    return await this.panel.isVisible();
  }


  // =========================================================
// ABRIR CARRITO
// =========================================================

/**
 * Abre el carrito de forma robusta.
 *
 * Si el primer clic no produce el cambio esperado,
 * Playwright vuelve a intentar la operación mientras
 * el panel continúe cerrado.
 *
 * No utilizamos waitForTimeout().
 */
async abrir(): Promise<void> {

  // Si el carrito ya está abierto,
  // no hacemos ninguna acción adicional.
  if (await this.panel.isVisible()) {
    return;
  }

  // Comprobamos primero que el botón exista
  // y esté disponible para interactuar.
  await expect(
    this.botonCarrito
  ).toBeVisible();

  await expect(
    this.botonCarrito
  ).toBeEnabled();


  // toPass vuelve a ejecutar este bloque
  // cuando la condición esperada todavía no se cumple.
  await expect(async () => {

    // Solamente hacemos clic si el panel
    // continúa cerrado.
    if (!(await this.panel.isVisible())) {

      // Usamos un timeout corto para cada intento.
      // Si el clic falla, toPass podrá volver a intentarlo.
      await this.botonCarrito.click({
        timeout: 2_000,
      });
    }


    // Después del clic esperamos que el panel aparezca.
    //
    // Si no aparece en este intento,
    // toPass volverá a ejecutar el bloque.
    await expect(
      this.panel
    ).toBeVisible({
      timeout: 1_500,
    });

  }).toPass({

    // Tiempo máximo total permitido
    // para lograr abrir el carrito.
    timeout: 10_000,

    // Intervalos entre reintentos.
    // No son pausas fijas del test:
    // forman parte del mecanismo de polling.
    intervals: [
      250,
      500,
      1_000,
    ],
  });
}


  // =========================================================
// CERRAR CARRITO
// =========================================================

/**
 * Cierra el carrito de forma robusta.
 *
 * Si el primer clic sobre el overlay no produce
 * el cierre esperado, Playwright vuelve a intentarlo.
 */
async cerrar(): Promise<void> {

  // Si el panel ya está cerrado,
  // no necesitamos hacer nada.
  if (!(await this.panel.isVisible())) {
    return;
  }


  // Reintentamos hasta comprobar
  // que el carrito realmente desapareció.
  await expect(async () => {

    // Solamente hacemos clic si el carrito
    // todavía continúa visible.
    if (await this.panel.isVisible()) {

      // Hacemos clic en una zona exterior
      // del panel lateral.
      await this.overlay.click({
        position: {
          x: 10,
          y: 10,
        },

        // Timeout corto por intento.
        timeout: 2_000,
      });
    }


    // Confirmamos que el panel esté oculto.
    await expect(
      this.panel
    ).toBeHidden({
      timeout: 1_500,
    });

  }).toPass({

    // Tiempo máximo total para cerrar.
    timeout: 10_000,

    // Intervalos progresivos entre reintentos.
    intervals: [
      250,
      500,
      1_000,
    ],
  });
}


  // =========================================================
  // VACIAR CARRITO
  // =========================================================

  /**
   * Elimina todos los productos existentes.
   *
   * Se utiliza antes de cada Test Case para garantizar
   * que todas las pruebas comiencen con carrito vacío.
   */
  async vaciar(): Promise<void> {

    // Nos aseguramos de que el carrito esté abierto.
    await this.abrir();


    // Localizamos únicamente los botones visibles
    // utilizados para quitar productos.
    const botonesEliminar = this.page.locator(
      '[data-testid^="remove-from-cart-"]:visible'
    );


    // Continuamos hasta que no quede ningún
    // producto dentro del carrito.
    while (
      await botonesEliminar.count() > 0
    ) {

      // Guardamos la cantidad actual.
      const cantidadAntes =
        await botonesEliminar.count();


      // Quitamos el primer producto disponible.
      await botonesEliminar
        .first()
        .click();


      // Esperamos automáticamente hasta confirmar
      // que la cantidad de productos disminuyó.
      //
      // No utilizamos waitForTimeout().
      await expect(
        botonesEliminar
      ).toHaveCount(
        cantidadAntes - 1
      );
    }


    // Dejamos nuevamente el carrito cerrado
    // antes de comenzar el Test Case.
    await this.cerrar();
  }


  // =========================================================
  // OBTENER PRODUCTO
  // =========================================================

  /**
   * Obtiene el contenedor de un producto
   * según su identificador.
   *
   * Ejemplo:
   *
   * productoId = 1
   *
   * busca:
   * data-testid="cart-item-1"
   */
  producto(
    productoId: number
  ): Locator {

    return this.page.getByTestId(
      `cart-item-${productoId}`
    );
  }


  // =========================================================
  // NOMBRE
  // =========================================================

  /**
   * Obtiene el nombre de un producto.
   */
  nombre(
    productoId: number
  ): Locator {

    return this
      .producto(productoId)
      .getByTestId(
        'cart-item-name'
      );
  }


  // =========================================================
  // CANTIDAD
  // =========================================================

  /**
   * Obtiene la cantidad mostrada.
   *
   * Ejemplos:
   * x1
   * x2
   * x3
   */
  cantidad(
    productoId: number
  ): Locator {

    return this
      .producto(productoId)
      .getByTestId(
        'cart-item-quantity'
      );
  }


  // =========================================================
  // SUBTOTAL
  // =========================================================

  /**
   * Obtiene el subtotal correspondiente
   * a un producto.
   */
  subtotal(
    productoId: number
  ): Locator {

    return this
      .producto(productoId)
      .getByTestId(
        'cart-item-subtotal'
      );
  }


  // =========================================================
  // ELIMINAR PRODUCTO
  // =========================================================

  /**
   * Elimina un producto específico del carrito.
   */
  async eliminar(
    productoId: number
  ): Promise<void> {

    // Localizamos el botón correspondiente.
    const botonEliminar =
      this.page.getByTestId(
        `remove-from-cart-${productoId}`
      );


    // Nos aseguramos de que esté disponible.
    await expect(
      botonEliminar
    ).toBeVisible();


    // Eliminamos el producto.
    await botonEliminar.click();
  }


  // =========================================================
  // FINALIZAR COMPRA
  // =========================================================

  /**
   * Hace clic en el botón Finalizar compra.
   */
  async finalizarCompra(): Promise<void> {

    // Nos aseguramos de que el botón esté disponible.
    await expect(
      this.botonCheckout
    ).toBeVisible();


    // Realizamos el checkout.
    await this.botonCheckout.click();
  }
}