/**
 * Formatea un número o string a formato de moneda con separadores de miles.
 * @param amount - Cantidad numérica o string del monto.
 * @param currencySymbol - Símbolo de la moneda (ej. "L.", "$", "EUR"). Por defecto "L.".
 * @param locale - Configuración regional para los decimales y separadores (por defecto "es-HN").
 */
export const formatCurrency = (
  amount: number | string,
  currencySymbol: string = "L.",
  locale: string = "es-HN",
): string => {
  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericValue)) {
    return `${currencySymbol} 0.00`;
  }

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return `${currencySymbol} ${formattedNumber}`;
};

/**
 * Formatea números enteros grandes con separadores de miles (sin símbolo de moneda).
 */
export const formatNumber = (
  value: number,
  locale: string = "es-HN",
): string => {
  return new Intl.NumberFormat(locale).format(value);
};
