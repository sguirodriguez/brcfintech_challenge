import { z } from "zod";
import Currencies from "../../database/models/currencies";

const walletSchema = z.object({
  coinSender: z.enum(["BTC", "USD"]),
  coinReceiver: z.enum(["BTC", "USD"]),
  valueCoinSender: z.string(),
  valueCoinReceiver: z.string(),
  type: z.enum(["buy", "sell"]),
});

type ExchangeInfo = z.infer<typeof walletSchema>;

class CalculateEchange {
  async execute(exhangeInfo: ExchangeInfo) {
    const validate = walletSchema.safeParse(exhangeInfo);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const coinSenderInfo = await Currencies.findOne({
      where: {
        symbol: exhangeInfo.coinSender,
      },
    });

    const coinReceiverInfo = await Currencies.findOne({
      where: {
        symbol: exhangeInfo.coinReceiver,
      },
    });

    if (!coinSenderInfo || !coinReceiverInfo) {
      return {
        status: 409,
        response: { error: "Moeda não encontrada" },
      };
    }

    return {
      status: 200,
      response: { data: exhangeInfo },
    };
  }
}

export default new CalculateEchange();
