import {
  test,
  expect,
} from '@playwright/test';

import {
  ProductApiClient,
} from '../api/ProductApiClient';

import {
  DATOS_PRODUCTOS_PRUEBA,
  PRODUCTOS,
} from '../data/constantes';

import {
  prepararEstadoLimpio,
} from '../utils/prepararEstado';


// Estructura mínima del producto
// que necesitamos validar.
type ProductoApi = {
  id: number;
  price: number;
};


test.describe(
  'Edición de producto por API',
  () => {

    test.beforeEach(
      async ({ request }) => {

        // Restauramos el catálogo original
        // antes del Test Case.
        await prepararEstadoLimpio(
          request
        );
      }
    );


    // =======================================================
    // TC-017
    // =======================================================

    test(
      'TC-017 - editar un producto actualiza su precio correctamente',
      async ({ request }) => {

        // Creamos nuestro cliente API.
        const api =
          new ProductApiClient(
            request
          );


        // Obtenemos un token de Administrador.
        const token =
          await api.obtenerToken(
            process.env.ADMIN_USERNAME!,
            process.env.ADMIN_PASSWORD!
          );


        const nuevoPrecio =
          DATOS_PRODUCTOS_PRUEBA
            .EDICION
            .nuevoPrecio;


        // ---------------------------------------------------
        // ACT
        // ---------------------------------------------------

        // Actualizamos el precio
        // del producto ID 1.
        const respuesta =
          await api.actualizarProducto(
            PRODUCTOS.LAPTOP,
            {
              price: nuevoPrecio,
            },
            token
          );


        // ---------------------------------------------------
        // ASSERT
        // ---------------------------------------------------

        // PUT exitoso debe responder 200.
        expect(
          respuesta.status()
        ).toBe(200);


        const productoActualizado =
         (await respuesta.json()) as ProductoApi;


        expect(
          productoActualizado.id
        ).toBe(
          PRODUCTOS.LAPTOP
        );


        expect(
          productoActualizado.price
        ).toBe(
          nuevoPrecio
        );


        // ---------------------------------------------------
        // SEGUNDA VERIFICACIÓN
        // ---------------------------------------------------

        // Consultamos nuevamente el producto
        // para comprobar que el cambio persistió.
        const verificacion =
          await api.obtenerProducto(
            PRODUCTOS.LAPTOP
          );


        expect(
          verificacion.status()
        ).toBe(200);


         const productoVerificado =
         (await verificacion.json()) as ProductoApi;   


        expect(
          productoVerificado.price
        ).toBe(
          nuevoPrecio
        );
      }
    );
  }
);