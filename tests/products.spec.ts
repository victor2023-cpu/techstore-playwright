import {
  test,
  expect,
} from '@playwright/test';

import {
  LoginPage,
} from '../pages/LoginPage';

import {
  ProductManagementPage,
} from '../pages/ProductManagementPage';

import {
  DATOS_PRODUCTOS_PRUEBA,
  PRODUCTOS,
} from '../data/constantes';

import {
  prepararEstadoLimpio,
} from '../utils/prepararEstado';


test.describe(
  'Gestión de productos',
  () => {

    // =======================================================
    // PRECONDICIÓN
    // =======================================================

    test.beforeEach(
      async ({
        page,
        request,
      }) => {

        // Dejamos TechStore en su estado inicial.
        await prepararEstadoLimpio(
          request
        );


        const loginPage =
          new LoginPage(page);

        const gestionPage =
          new ProductManagementPage(
            page
          );


        // Entramos a TechStore.
        await loginPage.ir();


        // Los casos de Gestión necesitan
        // permisos de Administrador.
        await loginPage.login(
          process.env.ADMIN_USERNAME!,
          process.env.ADMIN_PASSWORD!
        );


        // Abrimos la pantalla Gestión.
        await gestionPage.irAGestion();
      }
    );


    // =======================================================
    // TC-014
    // =======================================================

    test(
      'TC-014 - crear un producto correctamente lo agrega a la gestión',
      async ({ page }) => {

        const gestionPage =
          new ProductManagementPage(
            page
          );

        const datos =
          DATOS_PRODUCTOS_PRUEBA
            .CREACION_VALIDA;


        // TechStore comienza con
        // 10 productos semilla.
        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // Creamos el nuevo producto.
        await gestionPage.crearProducto(
          datos.nombre,
          datos.categoria,
          datos.precio
        );


       // TechStore conserva el texto del mensaje en el DOM,
// aunque después de unos segundos pueda ocultarlo.
//
// Por eso validamos su contenido y no exigimos
// que continúe visible en pantalla.
await expect(
  gestionPage.feedback
).toHaveText(
  `Producto "${datos.nombre}" creado correctamente.`
);


// -------------------------------------------------------
// VALIDAR RESULTADO REAL DE LA CREACIÓN
// -------------------------------------------------------
//
// Esta es la comprobación funcional más importante:
// el producto realmente debe existir en Gestión.
await expect(
  gestionPage.itemPorNombre(
    datos.nombre
  )
).toBeVisible();


// Antes había 10 productos.
// Después de crear uno correctamente deben existir 11.
await expect(
  gestionPage.items()
).toHaveCount(11);


        // El producto debe existir en Gestión.
        await expect(
          gestionPage.itemPorNombre(
            datos.nombre
          )
        ).toBeVisible();


        // Ahora deben existir 11 productos.
        await expect(
          gestionPage.items()
        ).toHaveCount(11);
      }
    );


    // =======================================================
    // TC-015
    // =======================================================

    test(
      'TC-015 - crear un producto sin nombre es rechazado por el formulario',
      async ({ page }) => {

        const gestionPage =
          new ProductManagementPage(
            page
          );

        const datos =
          DATOS_PRODUCTOS_PRUEBA
            .SIN_NOMBRE;


        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // Intentamos crear el producto
        // dejando Nombre vacío.
        await gestionPage
          .intentarCrearSinNombre(
            datos.categoria,
            datos.precio
          );


        // El navegador debe detectar
        // que falta un campo required.
        expect(
          await gestionPage
            .nombreTieneErrorRequired()
        ).toBe(true);


        // Ningún producto debe crearse.
        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // Tampoco debe aparecer confirmación
        // de creación exitosa.
        await expect(
          gestionPage.feedback
        ).toBeHidden();
      }
    );


    // =======================================================
    // TC-016
    // =======================================================

    test(
      'TC-016 - crear un producto con precio negativo es rechazado por el formulario',
      async ({ page }) => {

        const gestionPage =
          new ProductManagementPage(
            page
          );

        const datos =
          DATOS_PRODUCTOS_PRUEBA
            .PRECIO_NEGATIVO;


        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // Intentamos registrar
        // un precio negativo.
        await gestionPage.crearProducto(
          datos.nombre,
          datos.categoria,
          datos.precio
        );


        // El input tiene min="0",
        // por lo que -10 debe producir
        // un error rangeUnderflow.
        expect(
          await gestionPage
            .precioTieneErrorMinimo()
        ).toBe(true);


        // El producto no debe existir.
        await expect(
          gestionPage.itemPorNombre(
            datos.nombre
          )
        ).toHaveCount(0);


        // El catálogo de Gestión
        // debe continuar con 10.
        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // No debe mostrarse confirmación exitosa.
        await expect(
          gestionPage.feedback
        ).toBeHidden();
      }
    );


    // =======================================================
    // TC-018
    // =======================================================

    test(
      'TC-018 - eliminar un producto lo quita de la lista de gestión',
      async ({ page }) => {

        const gestionPage =
          new ProductManagementPage(
            page
          );


        // El producto ID 10 debe existir
        // inicialmente.
        await expect(
          gestionPage.item(
            PRODUCTOS.PARLANTE
          )
        ).toBeVisible();


        await expect(
          gestionPage.items()
        ).toHaveCount(10);


        // Eliminamos el producto.
        await gestionPage.eliminar(
          PRODUCTOS.PARLANTE
        );


        // Ya no debe aparecer.
        await expect(
          gestionPage.item(
            PRODUCTOS.PARLANTE
          )
        ).toHaveCount(0);


        // Quedan 9 productos.
        await expect(
          gestionPage.items()
        ).toHaveCount(9);
      }
    );
  }
);