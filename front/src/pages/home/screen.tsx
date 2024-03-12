import CardMarket from "components/cardMarket";
import Layout from "../../components/layout";
import "./styles.scss";
import TextComponent from "components/text";
import Balance from "components/balance";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
import { formatCurrency } from "utils/formatter";
import { BalanceTypes, ExchangeRates, Order, Transaction } from "./types";
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
    handleCompleteOrder: (payload: {
      amount: number;
      coin: "BTC" | "USD";
      type: string;
      orderId: number;
    }) => void;
    transactions: Transaction[] | null;
    loadingTransactions: boolean;
    myTransactions: Transaction[] | null;
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
    handleCompleteOrder,
    transactions,
    loadingTransactions,
    myTransactions,
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
                    key={item?.id + index}
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
            style={{ maxHeight: 411, minHeight: 411, overflowY: "auto" }}
          >
            <TextComponent style={{ marginBottom: 20 }}>Ordens</TextComponent>

            {loadingOrders ? (
              <LoadingComponent />
            ) : (
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
                  {orders?.map((item, index) => {
                    return (
                      <tr key={item.id + index}>
                        <td>{item?.amount}</td>
                        <td>{defineBitcoinValueInUsd(String(item?.amount))}</td>
                        <td>{translatorType[item?.type]}</td>
                        <td>
                          {item?.type !== "buy" ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={(event) => {
                                event.preventDefault();
                                handleCompleteOrder({
                                  amount: Number(item?.amount),
                                  coin: "BTC",
                                  orderId: item?.id,
                                  type: item?.type,
                                });
                              }}
                            >
                              Comprar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={(event) => {
                                event.preventDefault();
                                handleCompleteOrder({
                                  amount: Number(item?.amount),
                                  coin: "BTC",
                                  orderId: item?.id,
                                  type: item?.type,
                                });
                              }}
                            >
                              Vender
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {!orders ||
              (orders.length === 0 && (
                <TextComponent>Sem ordens para mostrar...</TextComponent>
              ))}
          </div>
        </div>

        <CardMarket exchangeRates={exchangeRates} loadingRates={loadingRates} />
      </div>

      <div
        className="container-table-style-default"
        style={{ maxHeight: 300, minHeight: 300, overflowY: "auto" }}
      >
        <TextComponent style={{ marginBottom: 20 }}>
          Minhas Ordens
        </TextComponent>

        {loadingOrders ? (
          <LoadingComponent />
        ) : (
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
              {myOrders?.map((item, index) => {
                return (
                  <tr key={item.id + index}>
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
              })}
            </tbody>
          </table>
        )}

        {!myOrders ||
          (myOrders.length === 0 && (
            <TextComponent>Sem ordens para mostrar...</TextComponent>
          ))}
      </div>

      <div className="container-table-last-transaction-and-my-transaction">
        <div
          className="container-table-style-default"
          style={{ maxHeight: 300, minHeight: 300, overflowY: "auto" }}
        >
          <TextComponent style={{ marginBottom: 20 }}>
            Últimas transações globais
          </TextComponent>
          {loadingTransactions ? (
            <LoadingComponent />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Conversão</th>
                  <th scope="col">Remetente</th>
                  <th scope="col">Destinatário</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((item, index) => (
                  <tr key={item?.id + index}>
                    <td>
                      {" "}
                      {item?.currencies?.symbol !== "BTC"
                        ? `USD -> USD`
                        : `BTC -> BTC`}
                    </td>
                    <td>{item?.walletSenderId}</td>
                    <td>{item?.walletReceiverId}</td>
                    <td>{item?.amount}</td>
                    <td>{item?.kind === "debit" ? "Débito" : "Crédito"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          className="container-table-style-default"
          style={{ maxHeight: 300, minHeight: 300, overflowY: "auto" }}
        >
          <TextComponent style={{ marginBottom: 20 }}>
            Minhas últimas transações
          </TextComponent>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Conversão</th>
                <th scope="col">Remetente</th>
                <th scope="col">Destinatário</th>
                <th scope="col">Valor</th>
                <th scope="col">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {myTransactions?.map((item, index) => (
                <tr key={item?.id + index}>
                  <td>
                    {item?.currencies?.symbol !== "BTC"
                      ? `USD -> USD`
                      : `BTC -> BTC`}
                  </td>
                  <td>{item?.walletSenderId}</td>
                  <td>{item?.walletReceiverId}</td>
                  <td>{item?.amount}</td>
                  <td>{item?.kind === "debit" ? "Débito" : "Crédito"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </Layout>
  );
};

export default ScreenHome;
