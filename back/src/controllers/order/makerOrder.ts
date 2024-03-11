import { z } from "zod";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";
import Orders from "../../database/models/orders";
import { Op } from "sequelize";
import sequelize from "../../database/models";
import calculateExchange from "./calculateExchange";

const orderSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  coin: z.enum(["BTC", "USD"]),
  type: z.enum(["buy", "sell"]),
});

type OrderInfo = z.infer<typeof orderSchema>;
const MAKER_FEE = 5;
const TAKER_FEE = 3;
class MakeOrder {
  async execute(orderInfo: OrderInfo) {
    const currency = await Currencies.findOne({
      where: {
        symbol: orderInfo.coin,
      },
    });

    if (!currency) {
      return {
        status: 500,
        response: {
          error: "Moeda não encontrada.",
        },
      };
    }

    const wallet = await Wallets.findOne({
      where: {
        userId: orderInfo.userId,
        currencyId: currency?.id,
      },
    });

    if (!wallet) {
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
        currencyId: currency.id,
        currencyAmount: currency.value,
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
          error: "Não foi possível cobrar as taxas.",
        },
      };
    }

    const fixed = orderInfo.coin === "BTC" ? 8 : 2;

    const valueAfterDiscountFee = parseFloat(
      Number(wallet?.balance - data?.value).toFixed(fixed)
    );

    const hasOrderToMakeTransaction = await Orders.findOne({
      where: {
        walletId: { [Op.notIn]: [wallet.id] },
        currencyId: currency.id,
        amount: orderInfo.amount,
        type: orderInfo.type === "buy" ? "sell" : "buy",
        status: "pending",
      },
      order: [["createdAt", "ASC"]],
    });

    if (hasOrderToMakeTransaction) {
      return this.makeTransaction({
        orderWasFound: hasOrderToMakeTransaction,
        orderWantCreate: orderInfo,
        valueAfterDiscountFee,
        walletInfo: wallet,
        currency,
      });
    }

    const makeOrderAndDiscountFee = await sequelize.transaction(async (t) => {
      const order = await Orders.create(
        {
          walletId: wallet.id,
          currencyId: currency.id,
          currencyAmount: currency.value,
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
          error: "Não foi possível criar a ordem.",
        },
      };
    }

    if (!makeOrderAndDiscountFee) {
      return {
        status: 500,
        response: {
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
    orderWasFound,
    orderWantCreate,
    valueAfterDiscountFee,
    walletInfo,
    currency,
  }: {
    orderWasFound: {
      id: number;
      walletId: number;
      currencyId: number;
      currencyAmount: number;
      amount: number;
      type: string;
      status: string;
    };
    orderWantCreate: OrderInfo;
    valueAfterDiscountFee: number;
    walletInfo: {
      id: number;
      userId: number;
      currencyId: number;
      balance: number;
    };
    currency: {
      id: number;
      name: string;
      description: string;
      symbol: string;
      value: number;
    };
  }) {
    const fixed = orderWantCreate.coin === "BTC" ? 8 : 2;

    const makeTransactionOderAndDiscount = await sequelize.transaction(
      async (t) => {
        const order = await Orders.create(
          {
            walletId: walletInfo.id,
            currencyId: currency.id,
            currencyAmount: currency.value,
            amount: orderWantCreate.amount,
            type: orderWantCreate.type,
            status: "completed",
          },
          { transaction: t }
        );

        await Wallets.update(
          { balance: sequelize.literal(`${valueAfterDiscountFee}`) },
          { where: { id: walletInfo.id }, transaction: t }
        );

        await Orders.update(
          {
            status: "completed",
          },
          {
            where: {
              id: orderWasFound.id,
            },
            transaction: t,
          }
        );

        return order;
      }
    );

    return {
      status: 200,
      response: {
        data: {
          ...makeTransactionOderAndDiscount?.dataValues,
          currencyAmount: Number(
            makeTransactionOderAndDiscount?.currencyAmount
          ),
          amount: Number(
            Number(makeTransactionOderAndDiscount?.amount).toFixed(fixed)
          ),
        },
      },
    };
  }
}

export default new MakeOrder();
