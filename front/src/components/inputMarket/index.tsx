import TextComponent from "components/text";
import "./styles.scss";
import { CSSProperties } from "react";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
const InputMarket = ({
  style,
  title = "titulo",
  type,
  selectedCoin,
  handleChangeCoin,
  coinValue,
  setCoinValue,
}: {
  style?: CSSProperties;
  title: string;
  type: string;
  selectedCoin: string;
  handleChangeCoin: ({ type, value }: { type: string; value: string }) => void;
  coinValue: number;
  setCoinValue: (value: number) => void;
}) => {
  return (
    <div className="container-input-market" style={style}>
      <TextComponent type="small">{title}</TextComponent>

      <div className="container-input-market-and-dropdown">
        <input
          type="text"
          value={coinValue}
          onChange={(event: any) => setCoinValue(event.target.value)}
          className="input-market"
        />

        <div className="dropdown">
          <button
            className="btn btn-secondary bg-transparent dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedCoin === "BTC" ? (
              <img src={btcIcon} width={25} height={25} alt="" />
            ) : (
              <img src={usdIcon} width={25} height={25} alt="" />
            )}
          </button>
          <ul className="dropdown-menu">
            <li>
              <div
                className="dropdown-row-market"
                onClick={() => handleChangeCoin({ type, value: "BTC" })}
              >
                <img src={btcIcon} width={25} height={25} alt="" />
                <TextComponent>BTC</TextComponent>
              </div>
            </li>

            <li>
              <div
                className="dropdown-row-market"
                onClick={() => handleChangeCoin({ type, value: "USD" })}
              >
                <img src={usdIcon} width={25} height={25} alt="" />
                <TextComponent>USD</TextComponent>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InputMarket;
