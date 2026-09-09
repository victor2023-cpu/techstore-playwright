// =========================================================
// PRODUCTOS CONOCIDOS DE TECHSTORE
// =========================================================
//
// Centralizamos IDs y textos conocidos para evitar
// escribir números o nombres directamente en los tests.

export const PRODUCTOS = {

  // Laptop Pro 14"
  LAPTOP: 1,

  // Auriculares inalámbricos
  AURICULARES: 2,

  // Monitor 27" 4K
  PRODUCTO_4: 4,

  // Smartphone X12
  SMARTPHONE: 6,

  // Smartwatch Fit 3
  PRODUCTO_7: 7,

  // Parlante Bluetooth
  PARLANTE: 10,

} as const;


// =========================================================
// NOMBRES DE PRODUCTOS
// =========================================================

export const NOMBRES_PRODUCTOS = {

  LAPTOP: 'Laptop Pro 14"',

  AURICULARES:
    'Auriculares inalámbricos',

  SMARTPHONE:
    'Smartphone X12',

  PARLANTE:
    'Parlante Bluetooth',

} as const;


// =========================================================
// DATOS PARA PRUEBAS DE GESTIÓN
// =========================================================

export const DATOS_PRODUCTOS_PRUEBA = {

  // Producto válido utilizado en TC-014.
  CREACION_VALIDA: {
    nombre: 'Producto QA Automatizado',
    categoria: 'Accesorios',
    precio: 79.99,
  },

  // Datos utilizados en TC-015.
  // Intencionalmente no contiene nombre.
  SIN_NOMBRE: {
    categoria: 'Accesorios',
    precio: 49.99,
  },

  // Producto utilizado en TC-016.
  PRECIO_NEGATIVO: {
    nombre: 'Producto Precio Negativo QA',
    categoria: 'Accesorios',
    precio: -10,
  },

  // Valor utilizado para editar la Laptop en TC-017.
  EDICION: {
    nuevoPrecio: 1199,
  },

} as const;


// =========================================================
// DATOS PARA BÚSQUEDA
// =========================================================

export const BUSQUEDAS = {

  // Corresponde a un producto real
  // del catálogo inicial de TechStore.
  EXISTENTE:
    'Smartphone X12',

  // Texto que no corresponde
  // a ningún producto existente.
  INEXISTENTE:
    'xyz-no-existe',

} as const;