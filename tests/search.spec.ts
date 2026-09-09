import {
  test,
  expect,
} from '@playwright/test';

import {
  LoginPage,
} from '../pages/LoginPage';

import {
  SearchPage,
} from '../pages/SearchPage';

import {
  BUSQUEDAS,
  NOMBRES_PRODUCTOS,
  PRODUCTOS,
} from '../data/constantes';

import {
  prepararEstadoLimpio,
} from '../utils/prepararEstado';


test.describe(
  'Búsqueda de productos',
  () => {

    // =======================================================
    // PRECONDICIÓN
    // =======================================================

    test.beforeEach(
      async ({
        page,
        request,
      }) => {

        await prepararEstadoLimpio(
          request
        );


        const loginPage =
          new LoginPage(page);


        await loginPage.ir();


        // Para buscar productos
        // utilizamos Customer.
        await loginPage.login(
          process.env.CUSTOMER_USERNAME!,
          process.env.CUSTOMER_PASSWORD!
        );
      }
    );


    // =======================================================
    // TC-019
    // =======================================================

    test(
      'TC-019 - buscar un producto existente muestra el producto esperado',
      async ({ page }) => {

        const searchPage =
          new SearchPage(page);


        // Buscamos Smartphone X12.
        await searchPage.buscar(
          BUSQUEDAS.EXISTENTE
        );


        // Debe existir exactamente
        // un resultado.
        await expect(
          searchPage.productos()
        ).toHaveCount(1);


        // Debe ser el producto ID 6.
        await expect(
          searchPage.producto(
            PRODUCTOS.SMARTPHONE
          )
        ).toBeVisible();


        // También comprobamos
        // el nombre esperado.
        await expect(
          searchPage.producto(
            PRODUCTOS.SMARTPHONE
          )
        ).toContainText(
          NOMBRES_PRODUCTOS.SMARTPHONE
        );
      }
    );


    // =======================================================
    // TC-020
    // =======================================================

    test(
      'TC-020 - buscar un producto inexistente muestra el estado sin resultados',
      async ({ page }) => {

        const searchPage =
          new SearchPage(page);


        // Buscamos un texto que
        // no corresponde a ningún producto.
        await searchPage.buscar(
          BUSQUEDAS.INEXISTENTE
        );


        // No debe existir ninguna tarjeta.
        await expect(
          searchPage.productos()
        ).toHaveCount(0);


        // TechStore debe mostrar
        // el mensaje de estado vacío.
        await expect(
          searchPage.mensajeSinResultados
        ).toBeVisible();


        await expect(
          searchPage.mensajeSinResultados
        ).toHaveText(
          'No se encontraron productos.'
        );
      }
    );
  }
);