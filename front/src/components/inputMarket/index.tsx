import TextComponent from "components/text";
import "./styles.scss";
import { CSSProperties } from "react";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
const InputMarket = ({
  style,
  title = "titulo",
}: {
  style?: CSSProperties;
  title: string;
}) => {
  return (
    <div className="container-input-market" style={style}>
      <TextComponent type="small">{title}</TextComponent>

      <div className="container-input-market-and-dropdown">
        <input type="text" className="input-market" />

        <div className="dropdown">
          <button
            className="btn btn-secondary bg-transparent dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={btcIcon} width={25} height={25} alt="" />
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
