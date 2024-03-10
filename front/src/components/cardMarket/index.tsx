import TextComponent from "components/text";
import "./styles.scss";
import { useState } from "react";
import InputMarket from "components/inputMarket";

const CardMarket = () => {
  const [type, setType] = useState("buy");
  const [coinSender, setCoinSender] = useState<"BTC" | "USD">("BTC");
  const [coinValueSender, setCoinValueSender] = useState("0");
  const [coinReceiver, setCoinReceiver] = useState<"BTC" | "USD">("USD");
  const [coinValueReceiver, setCoinValueReceiver] = useState("0");

  const handleChangeCoin = ({
    type,
    value,
  }: {
    type: string;
    value: "BTC" | "USD";
  }) => {
    if (type === "coinSender") {
      const coinReceiver = value === "BTC" ? "USD" : "BTC";
      setCoinSender(value);
      setCoinReceiver(coinReceiver);
    }
    if (type === "coinReceiver") {
      const coinsSender = value === "BTC" ? "USD" : "BTC";
      setCoinReceiver(value);
      setCoinSender(coinsSender);
    }
  };

  // const translatorFunction = {
  //   buy: () => {},
  //   sell: () => {},
  // };

  const translatorButton = {
    sell: "Vender",
    buy: "Comprar",
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
        <div>
          <InputMarket
            title={translatorButton[type]}
            type="coinSender"
            selectedCoin={coinSender}
            handleChangeCoin={handleChangeCoin}
            coinValue={coinValueSender}
            setCoinValue={setCoinValueSender}
          />

          <InputMarket
            title="Receber"
            type="coinReceiver"
            selectedCoin={coinReceiver}
            handleChangeCoin={handleChangeCoin}
            coinValue={coinValueReceiver}
            setCoinValue={setCoinValueReceiver}
            style={{ marginTop: 10 }}
          />
        </div>

        <button type="button" className="btn btn-dark">
          {translatorButton[type]}
        </button>
      </div>
    </div>
  );
};

export default CardMarket;
