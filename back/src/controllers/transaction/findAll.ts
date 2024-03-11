import { z } from "zod";
import Users from "../../database/models/users";
import Wallets from "../../database/models/wallets";
import Transactions from "../../database/models/transactions";
import { Op } from "sequelize";
import Currencies from "../../database/models/currencies";

const transactionSchema = z.object({
  userId: z.number(),
});

type Transaction = z.infer<typeof transactionSchema>;

class FindAllTransactions {
  async execute(user: Transaction) {
    const validate = transactionSchema.safeParse(user);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasUser = await Users.findByPk(user.userId);

    if (!hasUser) {
      return {
        status: 409,
        response: { error: "Usuário não encontrado." },
      };
    }

    const wallets = await Wallets.findAll({
      where: {
        userId: Number(user.userId),
      },
    });

    if (!wallets) {
      return {
        status: 409,
        response: { error: "Carteira não encontrada." },
      };
    }

    const walletsIds = wallets.map((item) => item.id);

    const transactions = await Transactions.findAll({
      where: {
        walletSenderId: {
          [Op.notIn]: walletsIds,
        },
        walletReceiverId: {
          [Op.notIn]: walletsIds,
        },
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
        },
      ],
    });

    if (!transactions) {
      return {
        status: 409,
        response: { error: "Transações não foram encontradas." },
      };
    }

    return {
      status: 200,
      response: { data: transactions },
    };
  }
}

export default new FindAllTransactions();
