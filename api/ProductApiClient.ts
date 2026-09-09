// APIRequestContext permite realizar
// peticiones HTTP desde Playwright.
//
// APIResponse representa la respuesta recibida.
import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';


// Estructura mínima que necesitamos
// de la respuesta del login.
type LoginResponse = {
  token: string;
};


export class ProductApiClient {

  constructor(
    private readonly request:
      APIRequestContext
  ) {}


  // =========================================================
  // OBTENER TOKEN
  // =========================================================

  /**
   * Inicia sesión vía API y retorna
   * el token necesario para operaciones protegidas.
   */
  async obtenerToken(
    username: string,
    password: string
  ): Promise<string> {

    const respuesta =
      await this.request.post(
        '/api/auth/login',
        {
          data: {
            username,
            password,
          },
        }
      );


    if (!respuesta.ok()) {
      throw new Error(
        `No se pudo autenticar para la prueba API. Status: ${respuesta.status()}`
      );
    }


const body =
  (await respuesta.json()) as LoginResponse;


    return body.token;
  }


  // =========================================================
  // EDITAR PRODUCTO
  // =========================================================

  /**
   * Actualiza un producto mediante:
   *
   * PUT /api/products/:id
   */
  async actualizarProducto(
    productoId: number,
    cambios: Record<string, unknown>,
    token: string
  ): Promise<APIResponse> {

    return this.request.put(
      `/api/products/${productoId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        data: cambios,
      }
    );
  }


  // =========================================================
  // CONSULTAR PRODUCTO
  // =========================================================

  /**
   * Obtiene posteriormente el producto
   * para comprobar que el cambio persistió.
   */
  async obtenerProducto(
    productoId: number
  ): Promise<APIResponse> {

    return this.request.get(
      `/api/products/${productoId}`
    );
  }
}