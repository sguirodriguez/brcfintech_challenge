import Orders from "../../database/models/orders";
import Wallets from "../../database/models/wallets";
import { Op } from "sequelize";

class FindAllOrders {
  async execute(userId: number) {
    try {
      const wallets = await Wallets.findAll({
        where: {
          userId,
        },
      });

      if (!wallets || wallets.length === 0) {
        return {
          status: 404,
          response: {
            error: "Nenhuma carteira encontrada para este usuário",
          },
        };
      }

      const walletIds = wallets.map((wallet) => wallet.id);

      const orders = await Orders.findAll({
        where: {
          walletId: {
            [Op.notIn]: walletIds,
          },
          status: "pending",
        },
        order: [["createdAt", "DESC"]],
      });

      if (!orders) {
        return {
          status: 404,
          response: {
            error: "Nenhuma ordem encontrada.",
          },
        };
      }

      return {
        status: 200,
        response: {
          data: orders,
        },
      };
    } catch (error) {
      return {
        status: 500,
        response: {
          error: "Erro interno do servidor",
        },
      };
    }
  }
}

export default new FindAllOrders();
