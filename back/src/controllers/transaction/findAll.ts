import { z } from "zod";
import Transactions from "../../database/models/transactions";
import Currencies from "../../database/models/currencies";

const transactionSchema = z.object({
  userId: z.number(),
});

type Transaction = z.infer<typeof transactionSchema>;

class FindAllTransactions {
  async execute(user: Transaction) {
    const transactions = await Transactions.findAll({
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
