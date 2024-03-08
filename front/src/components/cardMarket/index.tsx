import TextComponent from "components/text";
import "./styles.scss";
import { useState } from "react";
import InputMarket from "components/inputMarket";

const CardMarket = () => {
  const [type, setType] = useState("buy");

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
          <InputMarket title={type !== "sell" ? "Gastar" : "Vender"} />

          <InputMarket title="Receber" style={{ marginTop: 10 }} />
        </div>

        {type !== "sell" ? (
          <button type="button" className="btn btn-dark">
            Comprar
          </button>
        ) : (
          <button type="button" className="btn btn-dark">
            Vender
          </button>
        )}
      </div>
    </div>
  );
};

export default CardMarket;
