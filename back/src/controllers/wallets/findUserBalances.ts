import { z } from "zod";
import Users from "../../database/models/users";
import Wallets from "../../database/models/wallets";
import Currencies from "../../database/models/currencies";

const walletSchema = z.object({
  userId: z.number(),
});

type Wallet = z.infer<typeof walletSchema>;

class FindUserBalances {
  async execute(user: Wallet) {
    const validate = walletSchema.safeParse(user);

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

    const findBalances = await Wallets.findAll({
      where: {
        userId: hasUser.id,
      },
      include: [
        {
          model: Currencies,
          as: "currencies",
        },
      ],
    });

    return {
      status: 200,
      response: { data: findBalances },
    };
  }
}

export default new FindUserBalances();
