import TextComponent from "components/text";
import "./styles.scss";
import { useEffect, useState } from "react";
import InputMarket from "components/inputMarket";
import { ExchangeRates } from "pages/home/types";
import { applyMaskCoin, maskOnlyNumberUSD } from "utils/mask";
import { useAuth } from "context/auth";
import { toast } from "react-toastify";

const CardMarket = ({
  exchangeRates,
  loadingRates,
}: {
  exchangeRates: ExchangeRates;
  loadingRates: boolean;
}) => {
  const { socketInstance } = useAuth();
  const [type, setType] = useState("buy");
  const [bitcoinValue, setBitcoinValue] = useState("0");
  const [usdValue, setUsdValue] = useState("0");
  const [fee, setFee] = useState<{
    value: number;
    fee: number;
    coin: "BTC" | "USD";
  } | null>(null);
  const [loadingFee, setLoadingFee] = useState(false);

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
      setBitcoinValue(value);
      setUsdValue(applyMaskCoin(String(valueInUSD?.toFixed(2)), "USD"));
      return;
    }

    const valueInBitcoin =
      maskOnlyNumberUSD(value) * exchangeRates?.bitcoinToUsdRate;
    setUsdValue(value);
    setBitcoinValue(String(valueInBitcoin?.toFixed(8)));
    return;
  };

  const findFee = () => {
    if (maskOnlyNumberUSD(usdValue) < 1) {
      return;
    }
    setLoadingFee(true);
    socketInstance.emit("find_fee_exchange", {
      value: Number(Number(bitcoinValue)?.toFixed(8)),
      coin: "BTC",
      type: type,
    });
    setTimeout(() => {
      setLoadingFee(false);
    }, 2000);
  };

  const getValueFeeInUsd = () => {
    const valueInUSD = Number(fee?.value) * exchangeRates?.usdToBitcoinRate;
    return applyMaskCoin(String(valueInUSD?.toFixed(2)), "USD");
  };

  const handleMakeOrder = () => {
    if (!socketInstance) {
      return toast.error("Por favor, faça o login novamente.");
    }

    socketInstance.emit("make_order", {
      amount: Number(Number(bitcoinValue)?.toFixed(8)),
      coin: "BTC",
      type,
    });
  };

  useEffect(() => {
    findFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdValue]);

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on("fee_exchange_values", ({ data, error }) => {
        if (error) {
          return toast.error(error);
        }
        setFee(data);
      });

      socketInstance.on("make_order_response", ({ data, error }) => {
        if (error) {
          return toast.error(error);
        }
        if (data) return toast.success("Ordem criada com suscesso!");
      });
    }
  }, [socketInstance]);

  const showWarningMessage =
    maskOnlyNumberUSD(usdValue) > 0 && maskOnlyNumberUSD(usdValue) < 1;

  const showFee = fee?.value && maskOnlyNumberUSD(usdValue) > 1;

  const disableButton =
    loadingFee ||
    (maskOnlyNumberUSD(usdValue) > 0 && maskOnlyNumberUSD(usdValue) < 1) ||
    !fee?.value ||
    maskOnlyNumberUSD(usdValue) === 0;

  return (
    <div className="container-card-market">
      <div className="card-market-tabs">
        <div
          className={`left-tab ${type !== "buy" && "not-selected-tab"}`}
          onClick={() => {
            setType("buy");
            setBitcoinValue("0");
            setUsdValue("0");
          }}
        >
          <TextComponent>Comprar</TextComponent>
        </div>
        <div className="middle-in-tabs"></div>
        <div
          className={`right-tab ${type !== "sell" && "not-selected-tab"}`}
          onClick={() => {
            setType("sell");
            setBitcoinValue("0");
            setUsdValue("0");
          }}
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
              coinValue={bitcoinValue}
              setCoinValue={setBitcoinValue}
              handleChange={handleChangeValue}
            />

            <InputMarket
              title={translatorLabelButton[type]}
              selectedCoin="USD"
              coinValue={usdValue}
              setCoinValue={setUsdValue}
              handleChange={handleChangeValue}
              style={{ marginTop: 10 }}
            />

            {showWarningMessage && (
              <TextComponent style={{ marginTop: 10, color: "red" }}>
                * O valor precisa ser maior que 1 USD
              </TextComponent>
            )}

            {loadingFee ? (
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
              showFee && (
                <TextComponent style={{ marginTop: 10 }}>
                  {`* Uma taxa de ${fee?.fee}% será cobrada`}
                  <br />
                  <br />
                  taxa: {getValueFeeInUsd()} USD
                </TextComponent>
              )
            )}
          </div>
        )}

        <button
          type="button"
          className={`btn btn-dark ${disableButton && "button-not-touchable"}`}
          onClick={disableButton ? () => {} : () => handleMakeOrder()}
        >
          {translatorButton[type]}
        </button>
      </div>
    </div>
  );
};

export default CardMarket;
