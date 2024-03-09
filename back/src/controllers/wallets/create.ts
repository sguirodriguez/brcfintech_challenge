import { z } from "zod";
import Wallets from "../../database/models/wallets";

const walletSchema = z.object({
  userId: z.number(),
  currencyId: z.number(),
  balance: z.number(),
});

type Wallet = z.infer<typeof walletSchema>;

class CreateWallets {
  async execute(wallet: Wallet) {
    const validate = walletSchema.safeParse(wallet);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasWalletRegistered = await Wallets.findOne({
      where: {
        userId: wallet.userId,
        currencyId: wallet.currencyId,
      },
    });

    if (hasWalletRegistered) {
      return {
        status: 409,
        response: { error: "Carteira já existe." },
      };
    }

    const registerWallet = await Wallets.create({
      userId: wallet.userId,
      currencyId: wallet.currencyId,
      balance: wallet.balance,
    });

    if (!registerWallet) {
      return {
        status: 409,
        response: { error: "Não foi possível registrar." },
      };
    }

    return {
      status: 200,
      response: { data: registerWallet },
    };
  }
}

export default new CreateWallets();
