// Importamos las herramientas necesarias.
//
// expect:
// Permite esperar y validar estados de la interfaz.
//
// Page:
// Representa la pestaña del navegador.
import {
  expect,
  Page,
} from '@playwright/test';


export class LoginPage {

  // Guardamos la página recibida por Playwright.
  constructor(
    private readonly page: Page
  ) {}


  // =========================================================
  // ABRIR TECHSTORE
  // =========================================================

  /**
   * Abre la página principal de TechStore.
   *
   * La URL se obtiene desde baseURL,
   * configurado en playwright.config.ts.
   */
  async ir(): Promise<void> {

    await this.page.goto('/');
  }


  // =========================================================
  // LOGIN
  // =========================================================

  /**
   * Inicia sesión utilizando las credenciales recibidas.
   */
  async login(
    usuario: string,
    password: string
  ): Promise<void> {

    // Escribimos el nombre de usuario.
    await this.page
      .getByTestId('username-input')
      .fill(usuario);


    // Escribimos la contraseña.
    await this.page
      .getByTestId('password-input')
      .fill(password);


    // Hacemos clic en Iniciar sesión.
    await this.page
      .getByTestId('login-button')
      .click();


    // -------------------------------------------------------
    // ESPERAR LOGIN COMPLETO
    // -------------------------------------------------------

    // Esperamos hasta que aparezca un producto de la tienda.
    //
    // Esto indica que ya salimos correctamente
    // de la pantalla de Login y la aplicación está lista.
    await expect(
      this.page.getByTestId('add-to-cart-1')
    ).toBeVisible({
      timeout: 10_000,
    });


    // También comprobamos que el botón del carrito
    // esté disponible antes de continuar.
    await expect(
      this.page.getByTestId('cart-toggle')
    ).toBeVisible({
      timeout: 10_000,
    });
  }
}