import TextComponent from "components/text";
import "./styles.scss";
import { CSSProperties } from "react";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
import { applyMaskCoin } from "utils/mask";

const InputMarket = ({
  style,
  title = "titulo",
  selectedCoin,
  coinValue,
  handleChange,
}: {
  style?: CSSProperties;
  title: string;
  selectedCoin: "USD" | "BTC";
  coinValue: string;
  setCoinValue: (value: string) => void;
  handleChange: ({
    value,
    type,
  }: {
    value: string;
    type: "USD" | "BTC";
  }) => void;
}) => {
  return (
    <div className="container-input-market" style={style}>
      <TextComponent type="small">{title}</TextComponent>

      <div className="container-input-market-and-dropdown">
        <input
          type="text"
          value={coinValue}
          onChange={(event: any) =>
            handleChange({
              value: applyMaskCoin(event.target.value, selectedCoin),
              type: selectedCoin,
            })
          }
          style={{
            border: "none",
            outline: "none",
            fontSize: "16px",
            width: "100%",
          }}
          maxLength={15}
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
              <div className="dropdown-row-market">
                <img src={btcIcon} width={25} height={25} alt="" />
                <TextComponent>BTC</TextComponent>
              </div>
            </li>

            <li>
              <div className="dropdown-row-market">
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
