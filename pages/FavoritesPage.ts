import {
  Locator,
  Page,
} from '@playwright/test';


export class FavoritesPage {

  // Botón Favoritos del menú.
  readonly navFavoritos: Locator;

  // Vista completa de favoritos.
  readonly vistaFavoritos: Locator;

  // Número mostrado junto al menú Favoritos.
  readonly contadorFavoritos: Locator;

  // Contenedor de los productos favoritos.
  readonly gridFavoritos: Locator;

  // Mensaje mostrado cuando
  // no existen favoritos.
  readonly mensajeVacio: Locator;


  constructor(
    private readonly page: Page
  ) {

    this.navFavoritos =
      page.getByTestId(
        'nav-favorites'
      );

    this.vistaFavoritos =
      page.getByTestId(
        'favorites-view'
      );

    this.contadorFavoritos =
      page.getByTestId(
        'favorites-count'
      );

    this.gridFavoritos =
      page.getByTestId(
        'favorites-grid'
      );

    this.mensajeVacio =
      page.getByTestId(
        'favorites-empty'
      );
  }


  // =========================================================
  // BOTÓN FAVORITO
  // =========================================================

  /**
   * Un mismo producto puede existir en distintas vistas.
   *
   * Por eso seleccionamos únicamente
   * el botón que actualmente está visible.
   */
  botonFavorito(
    productoId: number
  ): Locator {

    return this.page.locator(
      `[data-testid="favorite-${productoId}"]:visible`
    );
  }


  // =========================================================
  // AGREGAR / ELIMINAR FAVORITO
  // =========================================================

  /**
   * El mismo botón funciona como:
   *
   * - agregar favorito
   * - eliminar favorito
   *
   * dependiendo del estado actual.
   */
  async alternarFavorito(
    productoId: number
  ): Promise<void> {

    await this
      .botonFavorito(productoId)
      .click();
  }


  // =========================================================
  // IR A FAVORITOS
  // =========================================================

  async irAFavoritos():
    Promise<void> {

    await this.navFavoritos.click();

    await this.vistaFavoritos.waitFor({
      state: 'visible',
    });
  }


  // =========================================================
  // PRODUCTOS FAVORITOS
  // =========================================================

  favoritos(): Locator {

    return this.gridFavoritos.locator(
      '.product-card'
    );
  }
}