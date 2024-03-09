import { z } from "zod";
import Currencies from "../../database/models/currencies";

const currencySchema = z.object({
  id: z.number(),
});

type Currency = z.infer<typeof currencySchema>;

class DeleteCurrency {
  async execute(currency: Currency) {
    const validate = currencySchema.safeParse(currency);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasCurrencyRegistered = await Currencies.findByPk(currency.id);

    if (!hasCurrencyRegistered) {
      return {
        status: 200,
        response: { error: "A moeda não possui cadastro." },
      };
    }

    hasCurrencyRegistered.destroy();

    return { status: 200, response: { data: true } };
  }
}

export default new DeleteCurrency();
