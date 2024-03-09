import { z } from "zod";
import Wallets from "../../database/models/wallets";

const walletSchema = z.object({
  id: z.number(),
  balance: z.number(),
});

type Wallet = z.infer<typeof walletSchema>;

class UpdateWallets {
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
        id: wallet.id,
      },
    });

    if (!hasWalletRegistered) {
      return {
        status: 409,
        response: { error: "Carteira não existe." },
      };
    }

    const hasBalance = wallet.balance ? { balance: wallet.balance } : {};

    const walletUpdated = await hasWalletRegistered.update({
      ...hasBalance,
    });

    return {
      status: 200,
      response: { data: walletUpdated },
    };
  }
}

export default new UpdateWallets();
