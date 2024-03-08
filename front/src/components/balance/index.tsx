import TextComponent from "components/text";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
import "./styles.scss";

const Balance = ({
  title,
  value,
  coin,
}: {
  title: string;
  value: string;
  coin: string;
}) => {
  return (
    <div className="container-balance">
      <TextComponent>{title}</TextComponent>
      <div className="align-value-balance">
        <img
          src={coin === "BTC" ? btcIcon : usdIcon}
          width={25}
          height={25}
          alt=""
        />
        <TextComponent>{value}</TextComponent>
      </div>
    </div>
  );
};

export default Balance;
