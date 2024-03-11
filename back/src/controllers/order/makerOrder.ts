import { z } from "zod";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";
import Orders from "../../database/models/orders";
import { Op } from "sequelize";

const orderSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  coin: z.enum(["BTC", "USD"]),
  type: z.enum(["buy", "sell"]),
});

type OrderInfo = z.infer<typeof orderSchema>;

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

    const hasOrderToMakeTransaction = await Orders.findOne({
      where: {
        walletId: { [Op.ne]: wallet.id },
        currencyId: currency.id,
        amount: orderInfo.amount,
        type: orderInfo.type === "buy" ? "sell" : "buy",
        status: "pending",
      },
      order: [["createdAt", "ASC"]],
    });

    if (hasOrderToMakeTransaction) {
      ///TO DO: MAKE TRANSACTION
      return {
        status: 500,
        response: {
          data: {
            hasOrderToMakeTransaction,
            status: "Precisa da funcao make transaction",
          },
        },
      };
    }

    const order = await Orders.create({
      walletId: wallet.id,
      currencyId: currency.id,
      currencyAmount: currency.value,
      amount: orderInfo.amount,
      type: orderInfo.type,
      status: "pending",
    });

    if (!order) {
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
          ...order?.dataValues,
          currencyAmount: Number(order?.currencyAmount),
          amount: Number(Number(order?.amount).toFixed(8)),
        },
      },
    };
  }
}

export default new MakeOrder();
