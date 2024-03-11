import CardMarket from "components/cardMarket";
import Layout from "../../components/layout";
import "./styles.scss";
import TextComponent from "components/text";
import Balance from "components/balance";
import btcIcon from "../../assets/icons/btc-icon.svg";
import usdIcon from "../../assets/icons/usd-icon.svg";
import { formatCurrency } from "utils/formatter";
import { BalanceTypes, ExchangeRates } from "./types";

const ScreenHome = ({
  handlers,
}: {
  handlers: {
    balances: BalanceTypes[] | null;
    loadingBalances: boolean;
    exchangeRates: ExchangeRates | null;
    loadingRates: boolean;
  };
}) => {
  const { balances, loadingBalances, exchangeRates, loadingRates } = handlers;

  return (
    <Layout>
      <div className="container-card-and-table-global">
        <div className="container-table-and-balances">
          <div className="balances">
            {loadingBalances ? (
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
          <div className="balances">
            <Balance
              title="Máximo em 24h (USD > BTC)"
              value="0.2333"
              coin="USD"
            />
            <Balance title="Mínimo em 24h (USD > BTC)" value="123" coin="USD" />
          </div>

          <div className="container-table-style-default">
            <TextComponent style={{ marginBottom: 20 }}>
              Criptomoedas
            </TextComponent>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">último Preço</th>
                  <th scope="col">Volume 24h</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src={btcIcon} width={25} height={25} alt="" /> {`BTC`}
                  </td>
                  <td>49.223</td>
                  <td>0.004</td>
                </tr>
                <tr>
                  <td>
                    <img src={usdIcon} width={25} height={25} alt="" /> {`USD`}
                  </td>
                  <td>49.223</td>
                  <td>0.004</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CardMarket exchangeRates={exchangeRates} loadingRates={loadingRates} />
      </div>

      <div className="container-table-style-default">
        <TextComponent style={{ marginBottom: 20 }}>Ofertas</TextComponent>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Valor BTC</th>
              <th scope="col">Valor USD</th>
              <th scope="col">Tipo</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
            </tr>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
            </tr>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
            </tr>
          </tbody>
        </table>
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
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
            </tr>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
            </tr>
            <tr>
              <td>49.223</td>
              <td>0.004</td>
              <td>Compra</td>
              <td>x</td>
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
