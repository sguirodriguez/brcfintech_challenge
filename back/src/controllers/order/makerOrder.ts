import { z } from "zod";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";
import Orders from "../../database/models/orders";
import { Op } from "sequelize";
import sequelize from "../../database/models";
import calculateExchange from "./calculateExchange";
import Transactions from "../../database/models/transactions";
import exchangeRate from "./exchangeRate";

const orderSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  coin: z.enum(["BTC", "USD"]),
  type: z.enum(["buy", "sell"]),
});

type OrderInfo = z.infer<typeof orderSchema>;

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
interface MakeTransactionByOrder {
  userId: number;
  wallet: WalletTypes | null;
  order: {
    id: number;
    walletId: number;
    currencyId: number;
    currencyAmount: number;
    amount: number;
    type: string;
    status: string;
    wallets: Wallets | null;
    currencies: Currencies | null;
  };
  amount: number;
  coin: "BTC" | "USD";
  type: "buy" | "sell";
  valueAfterDiscountFee: number;
}

class MakeOrder {
  async execute(orderInfo: OrderInfo) {
    const wallet: any = await Wallets.findOne({
      where: {
        userId: orderInfo.userId,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
          where: {
            symbol: orderInfo.coin,
          },
        },
      ],
    });

    if (!wallet || !wallet?.currencies?.value) {
      return {
        status: 500,
        response: {
          error: "Carteira não encontrada.",
        },
      };
    }

    const hasOrderCreated = await Orders.findOne({
      where: {
        walletId: wallet.id,
        currencyId: wallet.currencies.id,
        currencyAmount: wallet.currencies.value,
        amount: orderInfo.amount,
        type: orderInfo.type,
        status: "pending",
      },
    });

    if (hasOrderCreated) {
      return {
        status: 500,
        response: {
          error: "Você já criou uma ordem com esse valor.",
        },
      };
    }

    const { data, error } = await calculateExchange.findFee({
      value: orderInfo.amount,
      coin: orderInfo.coin,
      type: orderInfo.type,
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

    const fixed = orderInfo.coin === "BTC" ? 8 : 2;
    const valueFee = data.value;
    const wantsToBuy = orderInfo.type === "buy";

    const valueAfterDiscountFee = parseFloat(
      Number(wallet?.balance - valueFee).toFixed(fixed)
    );

    const hasOrderToMakeTransaction = await Orders.findOne({
      where: {
        walletId: { [Op.notIn]: [wallet.id] },
        currencyId: wallet.currencyId,
        amount: orderInfo.amount,
        type: wantsToBuy ? "sell" : "buy",
        status: "pending",
      },
      order: [["createdAt", "ASC"]],
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

    if (hasOrderToMakeTransaction) {
      return await this.makeTransaction({
        userId: orderInfo.userId,
        wallet,
        order: hasOrderToMakeTransaction as any,
        amount: orderInfo.amount,
        coin: orderInfo.coin,
        type: orderInfo.type,
        valueAfterDiscountFee,
      });
    }

    const makeOrderAndDiscountFee = await sequelize.transaction(async (t) => {
      const order = await Orders.create(
        {
          walletId: wallet.id,
          currencyId: wallet.currencyId,
          currencyAmount: wallet?.currencies?.value,
          amount: orderInfo.amount,
          type: orderInfo.type,
          status: "pending",
        },
        { transaction: t }
      );

      await Wallets.update(
        { balance: sequelize.literal(`${valueAfterDiscountFee}`) },
        { where: { id: wallet.id }, transaction: t }
      );

      return order;
    });

    if (!makeOrderAndDiscountFee) {
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
          ...makeOrderAndDiscountFee?.dataValues,
          currencyAmount: Number(makeOrderAndDiscountFee?.currencyAmount),
          amount: Number(
            Number(makeOrderAndDiscountFee?.amount).toFixed(fixed)
          ),
        },
      },
    };
  }

  async makeTransaction({
    userId,
    wallet,
    amount,
    coin,
    type,
    order,
    valueAfterDiscountFee,
  }: MakeTransactionByOrder) {
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

    const walletDestination: any = await Wallets.findOne({
      where: {
        userId: userId,
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

    if (!walletDestination || !wallet) {
      return {
        status: 500,
        response: {
          data: null,
          error: "Não foi possível encontrar a carteira destino.",
        },
      };
    }

    const walletOwnerOrder: any = order.wallets;

    const walletDestinationOwnerOrder: any = await Wallets.findOne({
      where: {
        userId: order?.wallets?.userId,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
          where: {
            symbol: order?.currencies?.symbol === "BTC" ? "USD" : "BTC",
          },
        },
      ],
    });

    if (!walletOwnerOrder || !walletDestinationOwnerOrder) {
      return {
        status: 500,
        response: {
          data: null,
          error: "Carteiras da ordem não foram encontradas.",
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

    const getValueDiscountInUSD = (value: number) => {
      return parseFloat(
        Number(Number(order.amount) * data?.usdToBitcoinRate).toFixed(2)
      );
    };

    const valueBTCWhoEmit = this.calculateValue({
      value: valueBTC,
      type,
      instance: "FIRST",
      discountOrSum: Number(order?.amount),
      fixed: 8,
    });

    const valueUSDWhoEmit = this.calculateValue({
      value: valueUSD,
      type,
      instance: "SECOND",
      discountOrSum: getValueDiscountInUSD(order.amount),
      fixed: 2,
    });

    const valueBTCWhoListening = this.calculateValue({
      value:
        walletDestinationOwnerOrder.currencies.symbol === "BTC"
          ? Number(walletDestinationOwnerOrder.balance)
          : Number(walletOwnerOrder.balance),
      type: order.type,
      instance: "FIRST",
      discountOrSum: Number(order?.amount),
      emitter: false,
      fixed: 8,
    });

    const valueUSDWhoListening = this.calculateValue({
      value:
        walletDestinationOwnerOrder.currencies.symbol === "USD"
          ? Number(walletDestinationOwnerOrder.balance)
          : Number(walletOwnerOrder.balance),
      type: order.type,
      instance: "SECOND",
      discountOrSum: getValueDiscountInUSD(order?.amount),
      emitter: false,
      fixed: 2,
    });

    console.log("values", {
      valueBTCWhoEmit,
      valueUSDWhoEmit,
      valueBTCWhoListening,
      valueUSDWhoListening,
    });

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
          { where: { id: wallet?.id }, transaction: t }
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
                  ? valueUSDWhoListening
                  : valueBTCWhoListening
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
    fixed,
  }: {
    value: number;
    type: string;
    instance: "FIRST" | "SECOND";
    discountOrSum: number;
    emitter?: boolean;
    fixed: number;
  }) {
    if (emitter) {
      if (instance === "FIRST" && type === "sell") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "FIRST" && type === "buy") {
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "SECOND" && type === "buy") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "SECOND" && type === "sell") {
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
      }
      return;
    }

    if (instance === "FIRST" && type === "sell") {
      return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
    }
    if (instance === "FIRST" && type === "buy") {
      return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
    }
    if (instance === "SECOND" && type === "buy") {
      return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
    }
    if (instance === "SECOND" && type === "sell") {
      return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
    }
  }
}

export default new MakeOrder();
