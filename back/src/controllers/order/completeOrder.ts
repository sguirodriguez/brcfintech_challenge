import { z } from "zod";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";
import Orders from "../../database/models/orders";
import sequelize from "../../database/models";
import calculateExchange from "./calculateExchange";
import Transactions from "../../database/models/transactions";
import exchangeRate from "./exchangeRate";
import { Order } from "sequelize";

const orderSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  coin: z.enum(["BTC", "USD"]),
  type: z.enum(["buy", "sell"]),
  orderId: z.number(),
});

type OrderComplete = z.infer<typeof orderSchema>;

interface WalletTypes {
  id: number;
  userId: number;
  currencyId: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
  currencies: {
    id: number;
    name: string;
    description: string;
    symbol: string;
    value: number;
    createdAt: string;
    updatedAt: string;
  };
}
interface MakeTransaction {
  wallet: WalletTypes;
  walletDestination: WalletTypes;
  walletOwnerOrder: WalletTypes;
  walletDestinationOwnerOrder: WalletTypes;
  order: Order | any;
  valueAfterDiscountFee: number;
  coin: "BTC" | "USD";
  type: "sell" | "buy";
}

class CompleteOrder {
  async execute(payload: OrderComplete) {
    const validate = orderSchema.safeParse(payload);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const findOrder: any = await Orders.findOne({
      where: {
        id: payload.orderId,
      },
      include: [
        {
          model: Wallets,
          as: "wallets",
        },
        {
          model: Currencies,
          as: "currencies",
        },
      ],
    });

    if (!findOrder) {
      return {
        status: 409,
        response: { error: "Ordem não encontrada." },
      };
    }

    const walletOwnerOrder = findOrder?.wallets;

    const walletDestinationOwnerOrder: any = await Wallets.findOne({
      where: {
        userId: findOrder?.wallets?.userId,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
          where: {
            symbol: findOrder?.currencies?.symbol === "BTC" ? "USD" : "BTC",
          },
        },
      ],
    });

    const wallet: any = await Wallets.findOne({
      where: {
        userId: payload.userId,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
        },
      ],
    });

    const walletDestination: any = await Wallets.findOne({
      where: {
        userId: payload.userId,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
          where: {
            symbol: wallet?.currencies?.symbol === "BTC" ? "USD" : "BTC",
          },
        },
      ],
    });

    if (
      !walletOwnerOrder ||
      !walletDestinationOwnerOrder ||
      !wallet ||
      !walletDestination
    ) {
      return {
        status: 500,
        response: {
          error: "As carteiras não foram encontradas.",
        },
      };
    }

    const { data, error } = await calculateExchange.findFee({
      value: payload.amount,
      coin: payload.coin,
      type: payload.type,
    });

    if (error || !data?.value) {
      return {
        status: 500,
        response: {
          data: null,
          error: "Não foi possível cobrar as taxas.",
        },
      };
    }
    const fixed = payload.coin === "BTC" ? 8 : 2;
    const valueFee = data.value;

    const valueAfterDiscountFee = parseFloat(
      Number(wallet?.balance - valueFee).toFixed(fixed)
    );

    return this.makeTransaction({
      wallet,
      walletDestination,
      order: findOrder,
      valueAfterDiscountFee,
      coin: payload.coin,
      walletOwnerOrder,
      walletDestinationOwnerOrder,
      type: payload.type,
    });
  }

  async makeTransaction({
    wallet,
    walletDestination,
    order,
    valueAfterDiscountFee,
    coin,
    walletOwnerOrder,
    walletDestinationOwnerOrder,
    type,
  }: MakeTransaction) {
    const {
      response: { data, error },
    } = await exchangeRate.execute();

    if (error || !data) {
      return {
        status: 500,
        response: {
          data: null,
          error: "Não foi possível encontrar o rate de exchange.",
        },
      };
    }

    const valueBTC =
      coin === "BTC"
        ? valueAfterDiscountFee
        : parseFloat(
            Number(Number(wallet?.balance) * data?.bitcoinToUsdRate).toFixed(8)
          );

    const valueUSD =
      coin === "USD"
        ? valueAfterDiscountFee
        : Number(walletDestination?.balance);

    const valueDiscountInUSD = parseFloat(
      Number(Number(order.amount) * data?.usdToBitcoinRate).toFixed(2)
    );

    const valueBTCWhoEmit = this.calculateValue({
      value: valueBTC,
      type: order.type === "buy" ? "sell" : "buy",
      instance: "FIRST",
      discountOrSum: Number(order?.amount),
    });

    const valueUSDWhoEmit = this.calculateValue({
      value: valueUSD,
      type: order.type === "buy" ? "sell" : "buy",
      instance: "SECOND",
      discountOrSum: valueDiscountInUSD,
    });

    const valueBTCWhoListening = this.calculateValue({
      value: valueBTC,
      type: order.type,
      instance: "FIRST",
      discountOrSum: Number(order?.amount),
      emitter: false,
    });

    const valueUSDWhoListening = this.calculateValue({
      value: valueUSD,
      type: order.type,
      instance: "SECOND",
      discountOrSum: Number(order?.amount),
      emitter: false,
    });

    console.log("values", {
      valueBTCWhoEmit,
      valueUSDWhoEmit,
      valueBTCWhoListening,
      valueUSDWhoListening,
    });
    return;
    const makeTransactionOderAndDiscount = await sequelize.transaction(
      async (t) => {
        //who is buying BTC - DEBIT
        await Transactions.create(
          {
            walletSenderId: walletDestination.id,
            walletReceiverId: walletOwnerOrder.id,
            orderId: order.id,
            currencyId: wallet?.currencies?.id,
            amount:
              wallet?.currencies?.symbol === "BTC"
                ? valueBTCWhoEmit
                : valueUSDWhoEmit,
            kind: "debit",
          },
          { transaction: t }
        );

        await Wallets.update(
          {
            balance: sequelize.literal(
              `${
                wallet?.currencies?.symbol === "BTC"
                  ? valueBTCWhoEmit
                  : valueUSDWhoEmit
              }`
            ),
          },
          { where: { id: wallet.id }, transaction: t }
        );

        await Wallets.update(
          {
            balance: sequelize.literal(
              `${
                walletDestination?.currencies?.symbol === "BTC"
                  ? valueBTCWhoEmit
                  : valueUSDWhoEmit
              }`
            ),
          },
          { where: { id: walletDestination.id }, transaction: t }
        );

        await Wallets.update(
          {
            balance: sequelize.literal(
              `${
                walletOwnerOrder?.currencies?.symbol === "BTC"
                  ? valueBTCWhoListening
                  : valueUSDWhoListening
              }`
            ),
          },
          { where: { id: walletOwnerOrder.id }, transaction: t }
        );

        await Wallets.update(
          {
            balance: sequelize.literal(
              `${
                walletDestinationOwnerOrder?.currencies?.symbol === "BTC"
                  ? valueBTCWhoListening
                  : valueUSDWhoListening
              }`
            ),
          },
          { where: { id: walletDestinationOwnerOrder.id }, transaction: t }
        );

        await Orders.update(
          {
            status: "completed",
          },
          {
            where: {
              id: order.id,
            },
            transaction: t,
          }
        );

        return {
          ...order,
          currencyAmount: order.currencyAmount,
          amount: order.amount,
        };
      }
    );

    if (!makeTransactionOderAndDiscount) {
      return {
        status: 500,
        response: {
          data: null,
          error: "Não foi possível criar a ordem.",
        },
      };
    }

    return {
      status: 200,
      response: {
        data: {
          ...makeTransactionOderAndDiscount,
          currencyAmount: Number(
            makeTransactionOderAndDiscount?.currencyAmount
          ),
          amount: Number(
            Number(makeTransactionOderAndDiscount?.amount).toFixed(
              coin === "BTC" ? 8 : 2
            )
          ),
        },
      },
    };
  }

  calculateValue({
    value,
    type,
    instance,
    discountOrSum,
    emitter = true,
  }: {
    value: number;
    type: string;
    instance: "FIRST" | "SECOND";
    discountOrSum: number;
    emitter?: boolean;
  }) {
    if (emitter) {
      if (instance === "FIRST" && type === "sell") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(8));
      }
      if (instance === "FIRST" && type === "buy") {
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(8));
      }
      if (instance === "SECOND" && type === "buy") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(8));
      }
      if (instance === "SECOND" && type === "sell") {
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(8));
      }
      return;
    }

    if (instance === "FIRST" && type === "sell") {
      return parseFloat(Number(value - Number(discountOrSum)).toFixed(8));
    }
    if (instance === "FIRST" && type === "buy") {
      return parseFloat(Number(value + Number(discountOrSum)).toFixed(8));
    }
    if (instance === "SECOND" && type === "buy") {
      return parseFloat(Number(value - Number(discountOrSum)).toFixed(8));
    }
    if (instance === "SECOND" && type === "sell") {
      return parseFloat(Number((value = +Number(discountOrSum))).toFixed(8));
    }
  }
}

export default new CompleteOrder();
