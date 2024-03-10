import React from "react";

interface InputWithMaskProps {
  mask: "BTC" | "USD";
  inputValue: string;
  setInputValue: (value: string) => void;
  className: string;
}

const InputWithMask: React.FC<InputWithMaskProps> = ({
  mask,
  inputValue,
  setInputValue,
  className,
}) => {
  const applyMask = (input: string): string => {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(applyMask(newValue));
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      style={{ border: "none", outline: "none", fontSize: "16px" }}
      className={className}
      maxLength={15}
    />
  );
};

export default InputWithMask;
