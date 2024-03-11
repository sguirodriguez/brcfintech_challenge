import TextComponent from "components/text";
import "./styles.scss";
import { useState } from "react";
import InputMarket from "components/inputMarket";
import { ExchangeRates } from "pages/home/types";
import { applyMaskCoin, maskOnlyNumberUSD } from "utils/mask";

const CardMarket = ({
  exchangeRates,
  loadingRates,
}: {
  exchangeRates: ExchangeRates;
  loadingRates: boolean;
}) => {
  const [type, setType] = useState("buy");
  const [coinValueSender, setCoinValueSender] = useState("0");
  const [coinValueReceiver, setCoinValueReceiver] = useState("0");

  // const translatorFunction = {
  //   buy: () => {},
  //   sell: () => {},
  // };

  const translatorButton = {
    sell: "Vender",
    buy: "Comprar",
  };

  const translatorLabelButton = {
    sell: "Receber",
    buy: "Gastar",
  };

  const handleChangeValue = ({
    value,
    type,
  }: {
    value: string;
    type: string;
  }) => {
    if (type === "BTC") {
      const valueInUSD = Number(value) * exchangeRates?.usdToBitcoinRate;
      setCoinValueSender(value);
      setCoinValueReceiver(applyMaskCoin(String(valueInUSD.toFixed(2)), "USD"));
      return;
    }

    const valueInBitcoin =
      maskOnlyNumberUSD(value) * exchangeRates?.bitcoinToUsdRate;
    setCoinValueReceiver(value);
    setCoinValueSender(String(valueInBitcoin.toFixed(8)));
    return;
  };

  return (
    <div className="container-card-market">
      <div className="card-market-tabs">
        <div
          className={`left-tab ${type !== "buy" && "not-selected-tab"}`}
          onClick={() => setType("buy")}
        >
          <TextComponent>Comprar</TextComponent>
        </div>
        <div className="middle-in-tabs"></div>
        <div
          className={`right-tab ${type !== "sell" && "not-selected-tab"}`}
          onClick={() => setType("sell")}
        >
          <TextComponent>Vender</TextComponent>
        </div>
      </div>

      <div className="content-card-market">
        {loadingRates ? (
          <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ padding: "40px 0px" }}
          >
            <div
              className="spinner-border"
              role="status"
              style={{ width: 22, height: 22 }}
            />
          </div>
        ) : (
          <div>
            <InputMarket
              title={translatorButton[type]}
              selectedCoin="BTC"
              coinValue={coinValueSender}
              setCoinValue={setCoinValueSender}
              handleChange={handleChangeValue}
            />

            <InputMarket
              title={translatorLabelButton[type]}
              selectedCoin="USD"
              coinValue={coinValueReceiver}
              setCoinValue={setCoinValueReceiver}
              handleChange={handleChangeValue}
              style={{ marginTop: 10 }}
            />
          </div>
        )}

        <button type="button" className="btn btn-dark">
          {translatorButton[type]}
        </button>
      </div>
    </div>
  );
};

export default CardMarket;
