import {
  Locator,
  Page,
} from '@playwright/test';


export class SearchPage {

  // Campo Buscar.
  readonly inputBusqueda: Locator;

  // Botón de búsqueda.
  readonly botonBuscar: Locator;

  // Contenedor del catálogo.
  readonly gridProductos: Locator;

  // Mensaje mostrado cuando
  // no existen resultados.
  readonly mensajeSinResultados: Locator;


  constructor(
    private readonly page: Page
  ) {

    this.inputBusqueda =
      page.getByTestId(
        'search-input'
      );

    this.botonBuscar =
      page.getByTestId(
        'search-button'
      );

    this.gridProductos =
      page.getByTestId(
        'product-grid'
      );

    this.mensajeSinResultados =
      page.getByTestId(
        'results-empty'
      );
  }


  // =========================================================
  // BUSCAR
  // =========================================================

  /**
   * Introduce un término y ejecuta la búsqueda.
   */
  async buscar(
    termino: string
  ): Promise<void> {

    await this.inputBusqueda.fill(
      termino
    );

    await this.botonBuscar.click();
  }


  // =========================================================
  // RESULTADOS
  // =========================================================

  /**
   * Devuelve todas las tarjetas
   * mostradas en el resultado.
   */
  productos(): Locator {

    return this.gridProductos.locator(
      '.product-card'
    );
  }


  /**
   * Devuelve un producto concreto por ID.
   */
  producto(
    productoId: number
  ): Locator {

    return this.page.getByTestId(
      `product-${productoId}`
    );
  }
}