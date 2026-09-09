// Locator representa un elemento localizado
// dentro de la interfaz.
//
// Page representa la pestaña del navegador.
import {
  Locator,
  Page,
} from '@playwright/test';


export class ProductManagementPage {

  // =========================================================
  // LOCATORS
  // =========================================================

  // Opción "Gestión" del menú lateral.
  readonly navGestion: Locator;

  // Vista completa de Gestión.
  readonly vistaGestion: Locator;

  // Campo Nombre del producto.
  readonly nombreNuevo: Locator;

  // Campo Categoría.
  readonly categoriaNueva: Locator;

  // Campo Precio.
  readonly precioNuevo: Locator;

  // Botón Crear producto.
  readonly botonCrear: Locator;

  // Mensaje mostrado después de una operación.
  readonly feedback: Locator;

  // Lista completa de productos administrables.
  readonly lista: Locator;


  constructor(
    private readonly page: Page
  ) {

    this.navGestion =
      page.getByTestId(
        'nav-manage'
      );

    this.vistaGestion =
      page.getByTestId(
        'manage-view'
      );

    this.nombreNuevo =
      page.getByTestId(
        'new-product-name'
      );

    this.categoriaNueva =
      page.getByTestId(
        'new-product-category'
      );

    this.precioNuevo =
      page.getByTestId(
        'new-product-price'
      );

    this.botonCrear =
      page.getByTestId(
        'create-product-button'
      );

    this.feedback =
      page.getByTestId(
        'manage-feedback'
      );

    this.lista =
      page.getByTestId(
        'manage-list'
      );
  }


  // =========================================================
  // IR A GESTIÓN
  // =========================================================

  /**
   * Abre la vista Gestión.
   */
  async irAGestion(): Promise<void> {

    await this.navGestion.click();

    // Esperamos que la vista realmente aparezca.
    await this.vistaGestion.waitFor({
      state: 'visible',
    });
  }


  // =========================================================
  // PRODUCTOS DE LA LISTA
  // =========================================================

  /**
   * Retorna todas las filas de productos
   * existentes en Gestión.
   */
  items(): Locator {

    return this.lista.locator(
      '.manage-item'
    );
  }


  /**
   * Busca un producto por su ID.
   *
   * Ejemplo:
   *
   * manage-item-10
   */
  item(
    productoId: number
  ): Locator {

    return this.page.getByTestId(
      `manage-item-${productoId}`
    );
  }


  /**
   * Busca un producto dentro de Gestión
   * utilizando su nombre.
   */
  itemPorNombre(
    nombre: string
  ): Locator {

    return this.lista
      .locator('.manage-item')
      .filter({
        hasText: nombre,
      });
  }


  // =========================================================
  // COMPLETAR FORMULARIO
  // =========================================================

  /**
   * Completa los tres campos del formulario.
   */
  async completarFormulario(
    nombre: string,
    categoria: string,
    precio: number
  ): Promise<void> {

    await this.nombreNuevo.fill(
      nombre
    );

    await this.categoriaNueva.fill(
      categoria
    );

    await this.precioNuevo.fill(
      String(precio)
    );
  }


  // =========================================================
  // CREAR PRODUCTO
  // =========================================================

  /**
   * Completa el formulario y pulsa
   * el botón Crear producto.
   */
  async crearProducto(
    nombre: string,
    categoria: string,
    precio: number
  ): Promise<void> {

    await this.completarFormulario(
      nombre,
      categoria,
      precio
    );

    await this.botonCrear.click();
  }


  // =========================================================
  // CREAR SIN NOMBRE
  // =========================================================

  /**
   * Intenta enviar el formulario dejando
   * intencionalmente vacío el nombre.
   *
   * Se utiliza en TC-015.
   */
  async intentarCrearSinNombre(
    categoria: string,
    precio: number
  ): Promise<void> {

    // Dejamos Nombre vacío.
    await this.nombreNuevo.fill('');

    await this.categoriaNueva.fill(
      categoria
    );

    await this.precioNuevo.fill(
      String(precio)
    );

    // El navegador debería impedir
    // el envío por el atributo required.
    await this.botonCrear.click();
  }


  // =========================================================
  // VALIDACIÓN HTML DEL NOMBRE
  // =========================================================

  /**
   * Consulta la validación nativa del navegador
   * para determinar si falta el nombre obligatorio.
   */
  async nombreTieneErrorRequired():
    Promise<boolean> {

    return this.nombreNuevo.evaluate(
      (
        elemento: HTMLInputElement
      ) => elemento.validity.valueMissing
    );
  }


  // =========================================================
  // VALIDACIÓN HTML DEL PRECIO
  // =========================================================

  /**
   * Comprueba si el precio ingresado está
   * debajo del mínimo permitido.
   *
   * TechStore utiliza min="0".
   */
  async precioTieneErrorMinimo():
    Promise<boolean> {

    return this.precioNuevo.evaluate(
      (
        elemento: HTMLInputElement
      ) => elemento.validity.rangeUnderflow
    );
  }


  // =========================================================
  // ELIMINAR PRODUCTO
  // =========================================================

  /**
   * Elimina un producto utilizando su ID.
   *
   * Este botón solamente aparece para Admin.
   */
  async eliminar(
    productoId: number
  ): Promise<void> {

    await this.page
      .getByTestId(
        `manage-delete-${productoId}`
      )
      .click();
  }
}