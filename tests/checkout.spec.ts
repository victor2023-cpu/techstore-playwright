// Importamos las herramientas principales de Playwright.
//
// test:
// Permite definir Test Cases.
//
// expect:
// Permite validar resultados.
import {
  test,
  expect,
} from '@playwright/test';


// =========================================================
// PAGE OBJECTS
// =========================================================

import {
  LoginPage,
} from '../pages/LoginPage';

import {
  StorePage,
} from '../pages/StorePage';

import {
  CartPage,
} from '../pages/CartPage';

import {
  CheckoutPage,
} from '../pages/CheckoutPage';


// =========================================================
// DATOS Y UTILIDADES
// =========================================================

// Productos conocidos utilizados
// durante las pruebas.
import {
  PRODUCTOS,
} from '../data/constantes';


// Convierte valores como:
//
// "$1299.00" -> 1299
import {
  convertirMonedaANumero,
} from '../utils/moneda';



test.describe('Checkout', () => {

  // =========================================================
  // BEFORE EACH
  // =========================================================
  //
  // Esta preparación se ejecuta antes de CADA Test Case.
  //
  // Garantizamos:
  //
  // 1. Usuario Customer autenticado.
  // 2. Carrito completamente vacío.
  //
  // Esto permite que los tests sean independientes.
  test.beforeEach(async ({ page }) => {

    // Creamos los Page Objects necesarios
    // para preparar la aplicación.
    const loginPage =
      new LoginPage(page);

    const cartPage =
      new CartPage(page);


    // Abrimos TechStore.
    await loginPage.ir();


    // Iniciamos sesión utilizando
    // las credenciales almacenadas en .env.
    await loginPage.login(
      process.env.CUSTOMER_USERNAME!,
      process.env.CUSTOMER_PASSWORD!
    );


    // Eliminamos cualquier producto
    // dejado por ejecuciones anteriores.
    await cartPage.vaciar();
  });


  // =========================================================
  // TC-119
  // COMPRAR UN PRODUCTO
  // =========================================================

  test(
    'TC-119 - comprar un producto genera una confirmación de pedido',
    async ({ page }) => {

      // Page Objects utilizados por este test.
      const storePage =
        new StorePage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // -------------------------------------------------------
      // ACT
      // -------------------------------------------------------

      // Agregamos una Laptop.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // -------------------------------------------------------
      // PREVALIDACIÓN
      // -------------------------------------------------------

      // Confirmamos que la Laptop esté presente.
      await expect(
        cartPage.producto(
          PRODUCTOS.LAPTOP
        )
      ).toBeVisible();


      // Como fue agregada una vez,
      // debe mostrar cantidad x1.
      await expect(
        cartPage.cantidad(
          PRODUCTOS.LAPTOP
        )
      ).toHaveText('x1');


      // -------------------------------------------------------
      // CHECKOUT
      // -------------------------------------------------------

      // Finalizamos la compra.
      await cartPage.finalizarCompra();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Una compra válida debe generar
      // una confirmación de pedido.
      await checkoutPage
        .esperarConfirmacion();
    }
  );


  // =========================================================
  // TC-120
  // COMPRAR MÚLTIPLES PRODUCTOS
  // =========================================================

  test(
    'TC-120 - comprar múltiples productos genera una confirmación de pedido',
    async ({ page }) => {

      // Page Objects utilizados.
      const storePage =
        new StorePage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // -------------------------------------------------------
      // ACT
      // -------------------------------------------------------

      // Agregamos tres productos diferentes.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );

      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_4
      );

      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_7
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // -------------------------------------------------------
      // PREVALIDACIÓN
      // -------------------------------------------------------

      // Debemos tener exactamente
      // tres productos diferentes.
      await expect(
        cartPage.items
      ).toHaveCount(3);


      // -------------------------------------------------------
      // CHECKOUT
      // -------------------------------------------------------

      await cartPage.finalizarCompra();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Confirmamos que la compra
      // se haya completado correctamente.
      await checkoutPage
        .esperarConfirmacion();
    }
  );


  // =========================================================
  // TC-123
  // TOTAL CONFIRMADO = TOTAL DEL CARRITO
  // =========================================================

  test(
    'TC-123 - el total confirmado del pedido coincide con el total del carrito',
    async ({ page }) => {

      // Page Objects necesarios.
      const storePage =
        new StorePage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // -------------------------------------------------------
      // ACT - PREPARAR CARRITO
      // -------------------------------------------------------

      // Agregamos tres productos diferentes.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );

      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_4
      );

      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_7
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // Confirmamos que tenemos
      // exactamente tres productos.
      await expect(
        cartPage.items
      ).toHaveCount(3);


      // -------------------------------------------------------
      // GUARDAR TOTAL ANTES DEL CHECKOUT
      // -------------------------------------------------------

      // Obtenemos el total mostrado actualmente.
      //
      // Ejemplo:
      //
      // "$4096.99"
      const textoTotalCarrito =
        await cartPage.total.textContent();


      // Si no obtenemos texto,
      // detenemos el test con un error claro.
      if (textoTotalCarrito === null) {
        throw new Error(
          'No fue posible obtener el total del carrito.'
        );
      }


      // Convertimos el total a número.
      const totalCarrito =
        convertirMonedaANumero(
          textoTotalCarrito
        );


      // -------------------------------------------------------
      // CHECKOUT
      // -------------------------------------------------------

      await cartPage.finalizarCompra();


      // Esperamos que aparezca la confirmación.
      await checkoutPage
        .esperarConfirmacion();


      // Obtenemos el total informado
      // por la confirmación.
      const totalConfirmado =
        await checkoutPage
          .obtenerTotalConfirmado();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Ambos valores deben coincidir
      // hasta dos decimales.
      expect(
        totalConfirmado
      ).toBeCloseTo(
        totalCarrito,
        2
      );
    }
  );


  // =========================================================
  // TC-130
  // CONFIRMACIÓN CON NÚMERO DE PEDIDO Y TOTAL
  // =========================================================

  test(
    'TC-130 - la confirmación muestra un número de pedido y un total',
    async ({ page }) => {

      // Page Objects necesarios.
      const storePage =
        new StorePage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // -------------------------------------------------------
      // ACT
      // -------------------------------------------------------

      // Agregamos un producto conocido.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // Verificamos que el producto esté presente.
      await expect(
        cartPage.producto(
          PRODUCTOS.LAPTOP
        )
      ).toBeVisible();


      // Finalizamos la compra.
      await cartPage.finalizarCompra();


      // -------------------------------------------------------
      // OBTENER CONFIRMACIÓN
      // -------------------------------------------------------

      // Esperamos la confirmación.
      await checkoutPage
        .esperarConfirmacion();


      // Obtenemos el mensaje completo.
      const textoConfirmacion =
        await checkoutPage
          .obtenerTextoConfirmacion();


      // Extraemos el número de pedido.
      const numeroPedido =
        await checkoutPage
          .obtenerNumeroPedido();


      // Extraemos el total confirmado.
      const totalConfirmado =
        await checkoutPage
          .obtenerTotalConfirmado();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Verificamos el formato principal
      // de la confirmación.
      //
      // Ejemplo esperado:
      //
      // ¡Pedido #25 confirmado! Total: $1299.00
      expect(
        textoConfirmacion
      ).toMatch(
        /Pedido #\d+ confirmado!\s*Total:\s*\$[\d,]+(?:\.\d{2})?/i
      );


      // El número de pedido debe ser
      // un valor positivo.
      expect(
        numeroPedido
      ).toBeGreaterThan(0);


      // La compra incluye un producto,
      // por lo que el total debe ser positivo.
      expect(
        totalConfirmado
      ).toBeGreaterThan(0);
    }
  );


  // =========================================================
  // TC-131
  // CARRITO VACÍO DESPUÉS DE LA COMPRA
  // =========================================================

  test(
    'TC-131 - una compra exitosa deja el carrito vacío',
    async ({ page }) => {

      // Page Objects necesarios.
      const storePage =
        new StorePage(page);

      const cartPage =
        new CartPage(page);

      const checkoutPage =
        new CheckoutPage(page);


      // -------------------------------------------------------
      // ACT - PREPARAR COMPRA
      // -------------------------------------------------------

      // Agregamos una Laptop.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // Confirmamos que antes de comprar
      // exista exactamente un producto.
      await expect(
        cartPage.items
      ).toHaveCount(1);


      // -------------------------------------------------------
      // CHECKOUT
      // -------------------------------------------------------

      // Finalizamos la compra.
      await cartPage.finalizarCompra();


      // Confirmamos que la compra
      // haya sido procesada correctamente.
      await checkoutPage
        .esperarConfirmacion();


      // -------------------------------------------------------
      // ABRIR CARRITO DESPUÉS DE COMPRAR
      // -------------------------------------------------------

      // Abrimos nuevamente el carrito.
      //
      // El método abrir() ya sabe comprobar
      // si está abierto o cerrado.
      await cartPage.abrir();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Después de una compra exitosa,
      // no debe quedar ningún producto.
      await expect(
        cartPage.items
      ).toHaveCount(0);


      // El total también debe volver
      // exactamente a $0.00.
      await expect(
        cartPage.total
      ).toHaveText(
        '$0.00'
      );
    }
  );

});