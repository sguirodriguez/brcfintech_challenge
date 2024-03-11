export const applyMaskCoin = (input: string, mask: string): string => {
  let value = input.replace(/\D/g, "");
  if (value.length > 1 && value[0] === "0" && value[1] !== "0") {
    value = value.slice(1);
  }
  if (value === "") {
    value = "0";
  }
  let formattedValue = "";
  if (mask === "BTC") {
    const btcValue = (parseFloat(value) / 100000000).toFixed(8);
    formattedValue = `${btcValue}`;
  } else if (mask === "USD") {
    let usdValue = (parseFloat(value) / 100).toFixed(2);
    usdValue = usdValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedValue = `${usdValue}`;
  }
  return formattedValue;
};

export function maskOnlyNumberUSD(currencyString: string): number {
  const cleanString = currencyString?.replace(/[.,]/g, "");
  const decimalPart = cleanString?.slice(-2);
  const integerPart = cleanString?.slice(0, -2);
  const numberString = `${integerPart}.${decimalPart}`;
  const numberValue = parseFloat(numberString);
  return numberValue;
}
