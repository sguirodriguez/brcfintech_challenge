import Orders from "../../database/models/orders";
import Wallets from "../../database/models/wallets";

class FindOrders {
  async execute(userId: number) {
    const wallet = await Wallets.findOne({
      where: {
        userId,
      },
    });

    if (!wallet) {
      return {
        status: 500,
        response: {
          error: "Carteira não encontrada",
        },
      };
    }

    const orders = await Orders.findAll({
      where: {
        walletId: wallet.id,
      },
    });

    if (!orders) {
      return {
        status: 500,
        response: {
          error: "Carteira não encontrada",
        },
      };
    }

    return {
      status: 200,
      response: {
        data: orders,
      },
    };
  }
}

export default new FindOrders();
