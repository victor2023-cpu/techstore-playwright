// Convierte un precio mostrado por TechStore
// desde texto a número.
//
// Ejemplos:
//
// "$1299.00"   -> 1299
// "$4,096.99" -> 4096.99
//
// Esta función puede reutilizarse en cualquier test
// donde necesitemos realizar cálculos con precios.
export function convertirMonedaANumero(
  texto: string
): number {

  // Eliminamos:
// - símbolo $
// - comas de miles
// - espacios
//
// Conservamos:
// - números
// - punto decimal
// - signo negativo, si existiera
  const valorLimpio = texto.replace(
    /[^0-9.-]/g,
    ''
  );

  // Convertimos el texto limpio a número.
  return Number(valorLimpio);
}