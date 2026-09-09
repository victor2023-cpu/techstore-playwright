import {
  test,
  expect,
} from '@playwright/test';

import {
  LoginPage,
} from '../pages/LoginPage';

import {
  FavoritesPage,
} from '../pages/FavoritesPage';

import {
  NOMBRES_PRODUCTOS,
  PRODUCTOS,
} from '../data/constantes';

import {
  prepararEstadoLimpio,
} from '../utils/prepararEstado';


test.describe(
  'Favoritos',
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


        await loginPage.login(
          process.env.CUSTOMER_USERNAME!,
          process.env.CUSTOMER_PASSWORD!
        );
      }
    );


    // =======================================================
    // TC-021
    // =======================================================

    test(
      'TC-021 - agregar un favorito lo muestra en la vista de favoritos',
      async ({ page }) => {

        const favoritesPage =
          new FavoritesPage(page);


        // Marcamos la Laptop
        // como favorita.
        await favoritesPage
          .alternarFavorito(
            PRODUCTOS.LAPTOP
          );


        // El contador debe aumentar a 1.
        await expect(
          favoritesPage
            .contadorFavoritos
        ).toHaveText('1');


        // Entramos a Favoritos.
        await favoritesPage
          .irAFavoritos();


        // Debe existir exactamente
        // un producto favorito.
        await expect(
          favoritesPage.favoritos()
        ).toHaveCount(1);


        // Ese producto debe ser
        // Laptop Pro 14".
        await expect(
          favoritesPage
            .gridFavoritos
        ).toContainText(
          NOMBRES_PRODUCTOS.LAPTOP
        );
      }
    );


    // =======================================================
    // TC-022
    // =======================================================

    test(
      'TC-022 - eliminar un favorito lo quita de la lista de favoritos',
      async ({ page }) => {

        const favoritesPage =
          new FavoritesPage(page);


        // Primero agregamos Auriculares
        // como favorito.
        await favoritesPage
          .alternarFavorito(
            PRODUCTOS.AURICULARES
          );


        await expect(
          favoritesPage
            .contadorFavoritos
        ).toHaveText('1');


        // Abrimos la vista Favoritos.
        await favoritesPage
          .irAFavoritos();


        await expect(
          favoritesPage.favoritos()
        ).toHaveCount(1);


        // Pulsamos nuevamente el corazón.
        // Ahora la acción significa eliminar.
        await favoritesPage
          .alternarFavorito(
            PRODUCTOS.AURICULARES
          );


        // La lista debe quedar vacía.
        await expect(
          favoritesPage.favoritos()
        ).toHaveCount(0);


        // Debe aparecer el mensaje
        // de favoritos vacíos.
        await expect(
          favoritesPage.mensajeVacio
        ).toBeVisible();


        // El contador también vuelve a cero.
        await expect(
          favoritesPage
            .contadorFavoritos
        ).toHaveText('0');
      }
    );
  }
);