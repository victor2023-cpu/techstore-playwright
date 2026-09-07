// Importamos las herramientas principales de Playwright.
//
// test:
// Permite definir nuestros Test Cases.
//
// expect:
// Permite validar que el resultado obtenido
// coincida con el resultado esperado.
import { test, expect } from '@playwright/test';


// Importamos los Page Objects.
//
// De esta manera los tests no necesitan conocer
// directamente los selectores HTML de la aplicación.
import { LoginPage } from '../pages/LoginPage';
import { StorePage } from '../pages/StorePage';
import { CartPage } from '../pages/CartPage';


// Importamos los productos definidos como constantes.
//
// Esto evita utilizar IDs "mágicos" como 1, 4 y 7
// directamente dentro de los Test Cases.
import { PRODUCTOS } from '../data/constantes';

// Utilidad para trabajar con precios.
import { convertirMonedaANumero } from '../utils/moneda';

test.describe('Carrito de compras', () => {

  // =========================================================
  // PRECONDICIÓN GENERAL
  // =========================================================
  //
  // Este bloque se ejecuta automáticamente ANTES
  // de cada Test Case de esta suite.
  //
  // Garantizamos que:
  //
  // 1. El usuario Customer esté autenticado.
  // 2. El carrito esté completamente vacío.
  //
  // Esto permite que cada test sea independiente
  // y no dependa de ejecuciones anteriores.
  test.beforeEach(async ({ page }) => {

    // Creamos los Page Objects necesarios
    // para preparar el estado inicial.
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);


    // Abrimos TechStore.
    //
    // Internamente utiliza el baseURL definido
    // en playwright.config.ts.
    await loginPage.ir();


    // Iniciamos sesión como Customer.
    //
    // Las credenciales se leen desde el archivo .env
    // para evitar dejarlas hardcodeadas en el test.
    await loginPage.login(
      process.env.CUSTOMER_USERNAME!,
      process.env.CUSTOMER_PASSWORD!
    );


    // Eliminamos cualquier producto que haya quedado
    // en el carrito de una ejecución anterior.
    await cartPage.vaciar();
  });


  // =========================================================
  // TC-101
  // =========================================================

  test(
    'TC-101 - agregar un producto muestra el producto con cantidad x1 en el carrito',
    async ({ page }) => {

      // Page Objects utilizados específicamente
      // durante este Test Case.
      const storePage = new StorePage(page);
      const cartPage = new CartPage(page);


      // -------------------------------------------------------
      // ACT
      // -------------------------------------------------------

      // Agregamos una Laptop al carrito.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );


      // Abrimos el carrito para comprobar
      // el resultado de la operación.
      await cartPage.abrir();

// =========================================================
// DIAGNÓSTICO TEMPORAL
// =========================================================
//
// Mostramos en la terminal exactamente qué productos
// y cantidades está viendo Playwright.
//
// Este código es solamente para investigar el fallo.
// Después de identificar el comportamiento lo retiraremos.

// Cantidad de filas de productos encontradas.
const cantidadFilas =
  await cartPage.items.count();

// Nombres de todos los productos encontrados.
const nombresProductos =
  await cartPage.items
    .getByTestId('cart-item-name')
    .allTextContents();

// Cantidades mostradas en todas las filas.
const cantidadesProductos =
  await cartPage.items
    .getByTestId('cart-item-quantity')
    .allTextContents();



      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Verificamos que la Laptop realmente exista
      // dentro del carrito.
      await expect(
        cartPage.producto(PRODUCTOS.LAPTOP)
      ).toBeVisible();


      // Verificamos el nombre exacto del producto.
      await expect(
        cartPage.nombre(PRODUCTOS.LAPTOP)
      ).toHaveText('Laptop Pro 14"');


      // Como el carrito comenzó vacío y agregamos
      // el producto una sola vez,
      // la cantidad esperada debe ser exactamente x1.
      await expect(
        cartPage.cantidad(PRODUCTOS.LAPTOP)
      ).toHaveText('x1');
    }
  );


  // =========================================================
  // TC-102
  // =========================================================

  test(
    'TC-102 - agregar tres productos diferentes muestra exactamente los tres productos en el carrito',
    async ({ page }) => {

      // Page Objects utilizados por este Test Case.
      const storePage = new StorePage(page);
      const cartPage = new CartPage(page);


      // -------------------------------------------------------
      // ACT
      // -------------------------------------------------------

      // Agregamos el producto 1.
      await storePage.agregarAlCarrito(
        PRODUCTOS.LAPTOP
      );


      // Agregamos el producto 4.
      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_4
      );


      // Agregamos el producto 7.
      await storePage.agregarAlCarrito(
        PRODUCTOS.PRODUCTO_7
      );


      // Abrimos el carrito.
      await cartPage.abrir();


      // -------------------------------------------------------
      // ASSERT
      // -------------------------------------------------------

      // Validamos que existan exactamente
      // tres productos diferentes en el carrito.
      await expect(
        cartPage.items
      ).toHaveCount(3);


      // Validamos que el producto 1 esté presente.
      await expect(
        cartPage.producto(PRODUCTOS.LAPTOP)
      ).toBeVisible();


      // Validamos que el producto 4 esté presente.
      await expect(
        cartPage.producto(PRODUCTOS.PRODUCTO_4)
      ).toBeVisible();


      // Validamos que el producto 7 esté presente.
      await expect(
        cartPage.producto(PRODUCTOS.PRODUCTO_7)
      ).toBeVisible();
    }
  );

  // =========================================================
// TC-110
// =========================================================

test(
  'TC-110 - el total del carrito coincide con la suma de los subtotales',
  async ({ page }) => {

    // Creamos los Page Objects utilizados
    // específicamente por este Test Case.
    const storePage = new StorePage(page);
    const cartPage = new CartPage(page);


    // -------------------------------------------------------
    // ACT
    // -------------------------------------------------------

    // Agregamos tres productos diferentes.
    //
    // El beforeEach ya garantizó que el carrito
    // estuviera completamente vacío.
    await storePage.agregarAlCarrito(
      PRODUCTOS.LAPTOP
    );

    await storePage.agregarAlCarrito(
      PRODUCTOS.PRODUCTO_4
    );

    await storePage.agregarAlCarrito(
      PRODUCTOS.PRODUCTO_7
    );


    // Abrimos el carrito para consultar
    // los subtotales y el total general.
    await cartPage.abrir();


    // -------------------------------------------------------
    // OBTENER SUBTOTALES
    // -------------------------------------------------------

    // Obtenemos el texto de todos los subtotales.
    //
    // Ejemplo:
    //
    // [
    //   "$1299.00",
    //   "$199.99",
    //   "$2499.00"
    // ]
    const textosSubtotales =
      await cartPage.subtotales.allTextContents();


    // Convertimos cada subtotal de texto a número.
    //
    // Ejemplo:
    //
    // "$1299.00" -> 1299
    const subtotalesNumericos =
      textosSubtotales.map(
        convertirMonedaANumero
      );


    // Sumamos todos los subtotales.
    //
    // Ejemplo:
    //
    // 1299 + 199.99 + 2499
    const sumaSubtotales =
      subtotalesNumericos.reduce(
        (
          acumulado,
          subtotalActual
        ) => acumulado + subtotalActual,
        0
      );


    // -------------------------------------------------------
    // OBTENER TOTAL DEL CARRITO
    // -------------------------------------------------------

    // Obtenemos el texto mostrado en el total general.
    //
    // Ejemplo:
    //
    // "$3997.99"
    const textoTotal =
      await cartPage.total.textContent();


    // Esta validación protege el test en caso de que
    // el elemento exista pero no tenga texto.
    if (textoTotal === null) {
      throw new Error(
        'No fue posible obtener el total del carrito.'
      );
    }


    // Convertimos el total mostrado a número.
    const totalCarrito =
      convertirMonedaANumero(
        textoTotal
      );


    // -------------------------------------------------------
    // ASSERT
    // -------------------------------------------------------

    // Comparamos:
    //
    // TOTAL MOSTRADO
    //
    // contra
    //
    // SUMA DE TODOS LOS SUBTOTALES
    //
    // Usamos toBeCloseTo con 2 decimales
    // porque estamos trabajando con valores monetarios.
    expect(
      totalCarrito
    ).toBeCloseTo(
      sumaSubtotales,
      2
    );
  }
);

// =========================================================
// TC-112
// =========================================================

test(
  'TC-112 - agregar tres veces el mismo producto incrementa su cantidad a x3',
  async ({ page }) => {

    // Creamos los Page Objects que utilizaremos
    // durante este Test Case.
    //
    // El beforeEach ya realizó:
    // - Login como Customer.
    // - Limpieza completa del carrito.
    const storePage = new StorePage(page);
    const cartPage = new CartPage(page);


    // -------------------------------------------------------
    // ACT
    // -------------------------------------------------------

    // Agregamos la misma Laptop por primera vez.
    await storePage.agregarAlCarrito(
      PRODUCTOS.LAPTOP
    );


    // Agregamos exactamente el mismo producto
    // una segunda vez.
    await storePage.agregarAlCarrito(
      PRODUCTOS.LAPTOP
    );


    // Agregamos el mismo producto
    // una tercera vez.
    await storePage.agregarAlCarrito(
      PRODUCTOS.LAPTOP
    );


    // Abrimos el carrito para comprobar
    // cómo TechStore agrupó las tres adiciones.
    await cartPage.abrir();


    // -------------------------------------------------------
    // ASSERT
    // -------------------------------------------------------

    // Aunque agregamos el mismo producto tres veces,
    // debería existir una sola línea de producto
    // dentro del carrito.
    await expect(
      cartPage.items
    ).toHaveCount(1);


    // Verificamos que la Laptop esté visible.
    await expect(
      cartPage.producto(PRODUCTOS.LAPTOP)
    ).toBeVisible();


    // La cantidad acumulada debe ser exactamente x3.
    //
    // Este es el comportamiento principal
    // que valida TC-112.
    await expect(
      cartPage.cantidad(PRODUCTOS.LAPTOP)
    ).toHaveText('x3');
  }
);

// =========================================================
// TC-113
// =========================================================

test(
  'TC-113 - eliminar un producto actualiza el contenido y el total del carrito',
  async ({ page }) => {

    // Creamos los Page Objects que utilizaremos
    // durante este Test Case.
    //
    // El beforeEach ya realizó:
    // - Login como Customer.
    // - Limpieza del carrito.
    const storePage = new StorePage(page);
    const cartPage = new CartPage(page);


    // -------------------------------------------------------
    // ACT - PREPARAR EL CARRITO
    // -------------------------------------------------------

    // Agregamos una Laptop.
    await storePage.agregarAlCarrito(
      PRODUCTOS.LAPTOP
    );

    // Agregamos un segundo producto diferente.
    //
    // Dejaremos este producto en el carrito después
    // de eliminar la Laptop.
    await storePage.agregarAlCarrito(
      PRODUCTOS.PRODUCTO_4
    );

    // Abrimos el carrito para realizar las validaciones.
    await cartPage.abrir();


    // -------------------------------------------------------
    // OBTENER EL SUBTOTAL DEL PRODUCTO QUE PERMANECERÁ
    // -------------------------------------------------------

    // Obtenemos el subtotal del producto 4 antes
    // de eliminar la Laptop.
    //
    // Ejemplo:
    // "$199.99"
    const textoSubtotalRestante =
      await cartPage
        .subtotal(PRODUCTOS.PRODUCTO_4)
        .textContent();

    // Verificamos que Playwright realmente haya podido
    // obtener el texto del subtotal.
    if (textoSubtotalRestante === null) {
      throw new Error(
        'No fue posible obtener el subtotal del producto restante.'
      );
    }

    // Convertimos el subtotal desde texto a número.
    //
    // Ejemplo:
    // "$199.99" -> 199.99
    const subtotalRestante =
      convertirMonedaANumero(
        textoSubtotalRestante
      );


    // -------------------------------------------------------
    // ACT - ELIMINAR PRODUCTO
    // -------------------------------------------------------

    // Eliminamos solamente la Laptop del carrito.
    await cartPage.eliminar(
      PRODUCTOS.LAPTOP
    );


    // -------------------------------------------------------
    // ASSERT - PRODUCTO ELIMINADO
    // -------------------------------------------------------

    // La Laptop ya no debe existir en el carrito.
    await expect(
      cartPage.producto(PRODUCTOS.LAPTOP)
    ).toHaveCount(0);


    // Debe quedar exactamente un producto.
    await expect(
      cartPage.items
    ).toHaveCount(1);


    // El producto 4 debe continuar visible.
    await expect(
      cartPage.producto(PRODUCTOS.PRODUCTO_4)
    ).toBeVisible();


    // -------------------------------------------------------
    // ASSERT - TOTAL ACTUALIZADO
    // -------------------------------------------------------

    // Obtenemos el nuevo total después
    // de eliminar la Laptop.
    const textoTotalActualizado =
      await cartPage.total.textContent();

    // Nos aseguramos de que el total tenga contenido.
    if (textoTotalActualizado === null) {
      throw new Error(
        'No fue posible obtener el total actualizado del carrito.'
      );
    }

    // Convertimos el total actualizado a número.
    const totalActualizado =
      convertirMonedaANumero(
        textoTotalActualizado
      );


    // Como solamente quedó el producto 4,
    // el total del carrito debe ser igual
    // al subtotal de ese producto.
    expect(
      totalActualizado
    ).toBeCloseTo(
      subtotalRestante,
      2
    );
  }
);

});