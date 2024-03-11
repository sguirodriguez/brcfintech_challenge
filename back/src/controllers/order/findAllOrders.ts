import Orders from "../../database/models/orders";
import Wallets from "../../database/models/wallets";
import { Op } from "sequelize";

class FindAllOrders {
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
        walletId: { [Op.ne]: wallet.id },
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

export default new FindAllOrders();
