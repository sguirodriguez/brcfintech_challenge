import { z } from "zod";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";
import Orders from "../../database/models/orders";
import sequelize from "../../database/models";
import calculateExchange from "./calculateExchange";
import Transactions from "../../database/models/transactions";
import exchangeRate from "./exchangeRate";
import { Order, Transaction } from "sequelize";

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
        response: { data: null, error: validate.error.issues[0].message },
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
        response: { data: null, error: "Ordem não encontrada." },
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

    const getValueDiscountInUSD = (value: number) => {
      return parseFloat(
        Number(Number(value) * data?.usdToBitcoinRate).toFixed(2)
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

    async function updateWalletBalance(
      walletId: number,
      balanceUpdate: number,
      transaction: Transaction
    ) {
      await Wallets.update(
        { balance: sequelize.literal(`${balanceUpdate}`) },
        { where: { id: walletId }, transaction }
      );
    }

    const makeTransactionOderAndDiscount = await sequelize.transaction(
      async (t: Transaction) => {
        const senderBalanceUpdate =
          wallet?.currencies?.symbol === "BTC"
            ? valueBTCWhoEmit || 0
            : valueUSDWhoEmit || 0;
        const destinationBalanceUpdate =
          walletDestination?.currencies?.symbol === "BTC"
            ? valueBTCWhoEmit || 0
            : valueUSDWhoEmit || 0;

        const ownerOrderBalanceUpdate =
          walletOwnerOrder?.currencies?.symbol === "BTC"
            ? valueUSDWhoListening || 0
            : valueBTCWhoListening || 0;

        const destinationOwnerOrderBalanceUpdate =
          walletDestinationOwnerOrder?.currencies?.symbol === "BTC"
            ? valueBTCWhoListening || 0
            : valueUSDWhoListening || 0;

        await Transactions.create(
          {
            walletSenderId: walletDestination.id,
            walletReceiverId: walletOwnerOrder.id,
            orderId: order.id,
            currencyId: walletDestination?.currencies?.id,
            amount:
              walletDestination?.currencies?.symbol === "BTC"
                ? Number(order?.amount)
                : getValueDiscountInUSD(order?.amount),
            kind: "credit",
          },
          { transaction: t }
        );

        await Transactions.create(
          {
            walletSenderId: walletOwnerOrder.id,
            walletReceiverId: walletDestination.id,
            orderId: order.id,
            currencyId: walletDestination?.currencies?.id,
            amount:
              walletDestination?.currencies?.symbol === "BTC"
                ? Number(order?.amount)
                : getValueDiscountInUSD(order?.amount),
            kind: "debit",
          },
          { transaction: t }
        );

        await Transactions.create(
          {
            walletSenderId: wallet.id,
            walletReceiverId: walletDestinationOwnerOrder.id,
            orderId: order.id,
            currencyId: wallet?.currencies?.id,
            amount:
              wallet?.currencies?.symbol === "BTC"
                ? Number(order?.amount)
                : getValueDiscountInUSD(order?.amount),
            kind: "debit",
          },
          { transaction: t }
        );

        await Transactions.create(
          {
            walletSenderId: walletDestinationOwnerOrder.id,
            walletReceiverId: wallet.id,
            orderId: order.id,
            currencyId: wallet?.currencies?.id,
            amount:
              wallet?.currencies?.symbol === "BTC"
                ? Number(order?.amount)
                : getValueDiscountInUSD(order?.amount),
            kind: "credit",
          },
          { transaction: t }
        );

        await updateWalletBalance(wallet.id, senderBalanceUpdate, t);

        await updateWalletBalance(
          walletDestination.id,
          destinationBalanceUpdate,
          t
        );

        await updateWalletBalance(
          walletOwnerOrder.id,
          ownerOrderBalanceUpdate,
          t
        );

        await updateWalletBalance(
          walletDestinationOwnerOrder.id,
          destinationOwnerOrderBalanceUpdate,
          t
        );

        await Orders.update(
          { status: "completed" },
          { where: { id: order.id }, transaction: t }
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
        error: null,
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
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "FIRST" && type === "buy") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "SECOND" && type === "buy") {
        return parseFloat(Number(value + Number(discountOrSum)).toFixed(fixed));
      }
      if (instance === "SECOND" && type === "sell") {
        return parseFloat(Number(value - Number(discountOrSum)).toFixed(fixed));
      }
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

export default new CompleteOrder();
