/**
 * Converts numbers into Nigerian legal currency words.
 * Example: 1500000 -> "ONE MILLION, FIVE HUNDRED THOUSAND NAIRA ONLY"
 */

const ONES = [
  "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
  "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
  "SEVENTEEN", "EIGHTEEN", "NINETEEN"
];

const TENS = [
  "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
];

function convertThreeDigitGroup(num: number): string {
  let result = "";
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    result += ONES[hundreds] + " HUNDRED";
    if (remainder > 0) {
      result += " AND ";
    }
  }

  if (remainder > 0) {
    if (remainder < 20) {
      result += ONES[remainder];
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;
      result += TENS[ten];
      if (one > 0) {
        result += " " + ONES[one];
      }
    }
  }

  return result;
}

export function numberToNairaWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return "ZERO NAIRA ONLY";
  }

  const integerPart = Math.floor(Math.abs(amount));
  const koboPart = Math.round((Math.abs(amount) - integerPart) * 100);

  if (integerPart === 0 && koboPart > 0) {
    return `${convertThreeDigitGroup(koboPart)} KOBO ONLY`;
  }

  const billions = Math.floor(integerPart / 1000000000);
  const millions = Math.floor((integerPart % 1000000000) / 1000000);
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  const hundreds = integerPart % 1000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(`${convertThreeDigitGroup(billions)} BILLION`);
  }
  if (millions > 0) {
    parts.push(`${convertThreeDigitGroup(millions)} MILLION`);
  }
  if (thousands > 0) {
    parts.push(`${convertThreeDigitGroup(thousands)} THOUSAND`);
  }
  if (hundreds > 0) {
    parts.push(convertThreeDigitGroup(hundreds));
  }

  let words = parts.join(", ");
  words = `${words} NAIRA`;

  if (koboPart > 0) {
    words += ` AND ${convertThreeDigitGroup(koboPart)} KOBO`;
  }

  words += " ONLY";
  return words;
}
