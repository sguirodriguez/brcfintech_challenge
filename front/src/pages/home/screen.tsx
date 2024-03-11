import CardMarket from "components/cardMarket";
import Layout from "../../components/layout";
import "./styles.scss";
import TextComponent from "components/text";
import Balance from "components/balance";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
import { formatCurrency } from "utils/formatter";
import { BalanceTypes, ExchangeRates, Order } from "./types";
import { applyMaskCoin } from "utils/mask";
import LoadingComponent from "components/loading";

const ScreenHome = ({
  handlers,
}: {
  handlers: {
    balances: BalanceTypes[] | null;
    loadingBalances: boolean;
    exchangeRates: ExchangeRates | null;
    loadingRates: boolean;
    orders: Order[] | null;
    loadingOrders: boolean;
    myOrders: Order[] | null;
    handleDeleteOrder: (orderId: number) => void;
  };
}) => {
  const {
    balances,
    loadingBalances,
    exchangeRates,
    loadingRates,
    orders,
    loadingOrders,
    myOrders,
    handleDeleteOrder,
  } = handlers;
  const translatorType = {
    buy: "Compra",
    sell: "Á venda",
  };

  const defineBitcoinValueInUsd = (value: string) => {
    const valueInUSD = Number(value) * exchangeRates?.usdToBitcoinRate;
    return applyMaskCoin(String(valueInUSD?.toFixed(2)), "USD");
  };

  return (
    <Layout>
      <div className="container-card-and-table-global">
        <div className="container-table-and-balances">
          <div className="balances">
            {loadingBalances ? (
              <LoadingComponent />
            ) : (
              balances?.map((item, index) => {
                return (
                  <Balance
                    key={item.id + index}
                    title={`Saldo ${item.currencies.symbol}`}
                    value={formatCurrency(
                      Number(item.balance),
                      String(item.currencies.symbol),
                      true
                    )}
                    coin={item.currencies.symbol}
                  />
                );
              })
            )}
          </div>

          <div
            className="container-table-style-default"
            style={{ maxHeight: 411, minHeight: 411 }}
          >
            <TextComponent style={{ marginBottom: 20 }}>Ordens</TextComponent>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Moeda BTC</th>
                  <th scope="col">Valor em USD</th>
                  <th scope="col">Tipo</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <LoadingComponent />
                ) : !orders || orders?.length === 0 ? (
                  <tr>
                    <td>
                      <TextComponent style={{ color: "black", marginTop: 50 }}>
                        Sem ordens para mostrar...
                      </TextComponent>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ) : (
                  orders?.map((item, index) => {
                    return (
                      <tr key={item.id + index}>
                        <td>{item?.amount}</td>
                        <td>{defineBitcoinValueInUsd(String(item?.amount))}</td>
                        <td>{translatorType[item?.type]}</td>
                        <td>x</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CardMarket exchangeRates={exchangeRates} loadingRates={loadingRates} />
      </div>

      <div className="container-table-style-default">
        <TextComponent style={{ marginBottom: 20 }}>
          Minhas ordens
        </TextComponent>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Valor BTC</th>
              <th scope="col">Valor USD</th>
              <th scope="col">Tipo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loadingOrders ? (
              <LoadingComponent />
            ) : !myOrders || myOrders?.length === 0 ? (
              <tr>
                <td>
                  <TextComponent style={{ color: "black", marginTop: 10 }}>
                    Sem ordens para mostrar...
                  </TextComponent>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ) : (
              myOrders?.map((item, index) => {
                return (
                  <tr key={item?.id + index}>
                    <td>{item?.amount}</td>
                    <td>{defineBitcoinValueInUsd(String(item?.amount))}</td>
                    <td>{translatorType[item?.type]}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(event) => {
                          event.preventDefault();
                          handleDeleteOrder(item.id);
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="container-table-style-default">
        <TextComponent style={{ marginBottom: 20 }}>Criptomoedas</TextComponent>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">último Preço</th>
              <th scope="col">Volume 24h</th>
              <th scope="col">Máximo em 24h (USD - BTC)</th>
              <th scope="col">Mínimo em 24h (USD - BTC)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "15%" }}>
                <img src={btcIcon} width={25} height={25} alt="" /> {`BTC`}
              </td>
              <td>49.223</td>
              <td>0.004</td>
              <td>0.004</td>
              <td>0.004</td>
            </tr>
            <tr>
              <td style={{ width: "15%" }}>
                <img src={usdIcon} width={25} height={25} alt="" /> {`USD`}
              </td>
              <td>49.223</td>
              <td>0.004</td>
              <td>0.004</td>
              <td>0.004</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container-table-last-transaction-and-my-transaction">
        <div className="container-table-style-default">
          <TextComponent style={{ marginBottom: 20 }}>
            Últimas transações globais
          </TextComponent>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Conversão</th>
                <th scope="col">Volume</th>
                <th scope="col">Valor</th>
                <th scope="col">Taxa</th>
                <th scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="container-table-style-default">
          <TextComponent style={{ marginBottom: 20 }}>
            Minhas últimas transações
          </TextComponent>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Conversão</th>
                <th scope="col">Volume</th>
                <th scope="col">Valor</th>
                <th scope="col">Taxa</th>
                <th scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
              <tr>
                <td>{`USD -> BTC`}</td>
                <td>49.223</td>
                <td>0.004</td>
                <td>0.004</td>
                <td>Compra</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ScreenHome;
