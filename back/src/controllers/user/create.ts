import { z } from "zod";
import Users from "../../database/models/users";
import jwt from "../../services/partners/jwt";
import Currencies from "../../database/models/currencies";
import Wallets from "../../database/models/wallets";

const userSchema = z.object({
  username: z.string().min(3, { message: "O nome precisa de  3 carateres." }),
});

type User = z.infer<typeof userSchema>;

class CreateUser {
  async execute(user: User) {
    const validate = userSchema.safeParse(user);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasUserRegistered = await Users.findOne({
      where: {
        username: user.username,
      },
    });

    const token = jwt.generateToken(user);

    if (hasUserRegistered?.dataValues) {
      const userUpdated = await hasUserRegistered.update({
        token,
      });

      return { status: 200, response: { data: userUpdated } };
    }

    const registerUser = await Users.create({
      ...user,
      token,
    });

    if (!registerUser) {
      return {
        status: 500,
        response: { error: "Não foi possível criar usuário." },
      };
    }

    const findBTC = await Currencies.findOne({
      where: {
        symbol: "BTC",
      },
    });

    const findUSD = await Currencies.findOne({
      where: {
        symbol: "USD",
      },
    });

    if (!findBTC || !findUSD) {
      return {
        status: 500,
        response: { error: "Não foi encontrado moedas." },
      };
    }

    await Wallets.create({
      userId: registerUser.id,
      currencyId: findBTC.id,
      balance: 100,
    });

    await Wallets.create({
      userId: registerUser.id,
      currencyId: findUSD.id,
      balance: 100000,
    });

    return { status: 200, response: { data: registerUser } };
  }
}

export default new CreateUser();
