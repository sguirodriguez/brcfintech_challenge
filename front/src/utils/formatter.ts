import accounting from "accounting";

function formatBitcoin(value: number, showPrefix?: boolean): string {
  return `${value.toFixed(8)}${showPrefix ? " BTC" : ""}`;
}

export function formatCurrency(
  value: number,
  currency: string,
  showPrefix?: boolean
): string {
  if (currency === "BTC") {
    return formatBitcoin(value, showPrefix);
  }

  const formattedValue = accounting.formatMoney(value, {
    symbol: "",
    precision: 2,
  });

  if (showPrefix) {
    return `${formattedValue} ${currency}`;
  }
  return formattedValue;
}

export function formatCurrencyInput(value: string, currency: string): string {
  const cleanedValue = value.replace(/[^0-9.]/g, "");
  const [integerPart, decimalPart] = cleanedValue.split(".");
  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let formattedDecimalPart = decimalPart ? decimalPart.padEnd(2, "0") : "00";
  if (currency === "BTC") {
    formattedDecimalPart = formattedDecimalPart.slice(0, 8);
  } else {
    formattedDecimalPart = formattedDecimalPart.slice(0, 2);
  }
  const formattedValue = `${formattedIntegerPart}.${formattedDecimalPart}`;

  return formattedValue;
}
