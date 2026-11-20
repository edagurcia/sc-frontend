export type Language = "es" | "en";

export const amountToWords = (
  amount: number,
  lang: Language = "es",
  currencyName?: string,
): string => {
  const [integerPart, decimalPart] = amount.toFixed(2).split(".").map(Number);

  const unitsEs = [
    "",
    "un",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const tensEs = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const teensEs = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const hundredsEs = [
    "",
    "ciento",
    "dosocientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  const unitsEn = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const tensEn = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const teensEn = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const convertGroupEs = (n: number): string => {
    if (n === 0) return "";
    if (n === 100) return "cien";
    let str = "";
    const h = Math.floor(n / 100);
    const r = n % 100;
    const t = Math.floor(r / 10);
    const u = r % 10;

    if (h > 0) str += hundredsEs[h] + " ";
    if (r >= 10 && r < 20) {
      str += teensEs[r - 10];
    } else {
      if (t > 0) str += tensEs[t] + (u > 0 ? " y " : "");
      if (u > 0) str += unitsEs[u];
    }
    return str.trim();
  };

  const convertGroupEn = (n: number): string => {
    if (n === 0) return "";
    let str = "";
    const h = Math.floor(n / 100);
    const r = n % 100;
    const t = Math.floor(r / 10);
    const u = r % 10;

    if (h > 0) str += unitsEn[h] + " hundred ";
    if (r >= 10 && r < 20) {
      str += teensEn[r - 10];
    } else {
      if (t > 0) str += tensEn[t] + (u > 0 ? "-" : "");
      if (u > 0) str += unitsEn[u];
    }
    return str.trim();
  };

  const numberToWordsEs = (num: number): string => {
    if (num === 0) return "cero";
    let words = "";
    const millions = Math.floor(num / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;

    if (millions > 0)
      words +=
        millions === 1 ? "un millón " : `${convertGroupEs(millions)} millones `;
    if (thousands > 0)
      words += thousands === 1 ? "mil " : `${convertGroupEs(thousands)} mil `;
    if (remainder > 0) words += convertGroupEs(remainder);

    return words.trim();
  };

  const numberToWordsEn = (num: number): string => {
    if (num === 0) return "zero";
    let words = "";
    const millions = Math.floor(num / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;

    if (millions > 0) words += `${convertGroupEn(millions)} million `;
    if (thousands > 0) words += `${convertGroupEn(thousands)} thousand `;
    if (remainder > 0) words += convertGroupEn(remainder);

    return words.trim();
  };

  const words =
    lang === "es" ? numberToWordsEs(integerPart) : numberToWordsEn(integerPart);
  const cents = decimalPart.toString().padStart(2, "0");

  const curr = currencyName
    ? ` ${currencyName}`
    : lang === "es"
      ? " lempiras"
      : " dollars";

  const decimalsText =
    lang === "es" ? ` con ${cents}/100` : ` and ${cents}/100`;

  return `${words}${curr}${decimalsText}`.toUpperCase();
};
