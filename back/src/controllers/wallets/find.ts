import { z } from "zod";
import Wallets from "../../database/models/wallets";

const walletSchema = z.object({
  id: z.number(),
});

type Wallet = z.infer<typeof walletSchema>;

class FindWallets {
  async execute(wallet: Wallet) {
    const validate = walletSchema.safeParse(wallet);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasWalletRegistered = await Wallets.findByPk(wallet.id);

    if (!hasWalletRegistered) {
      return {
        status: 409,
        response: { error: "Carteira não existe." },
      };
    }

    return {
      status: 200,
      response: { data: hasWalletRegistered },
    };
  }
}

export default new FindWallets();
