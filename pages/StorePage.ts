// Importamos Page para interactuar con la aplicación.
import { Page } from '@playwright/test';

export class StorePage {

  constructor(
    private readonly page: Page
  ) {}

  // Agrega al carrito el producto cuyo ID recibimos como parámetro.
  async agregarAlCarrito(
    productoId: number
  ): Promise<void> {

    // Ejemplo:
    // productoId = 1
    // genera el locator data-testid="add-to-cart-1"
    await this.page
      .getByTestId(`add-to-cart-${productoId}`)
      .click();
  }
}