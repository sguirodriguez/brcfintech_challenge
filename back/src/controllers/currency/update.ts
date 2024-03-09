import { z } from "zod";
import Currencies from "../../database/models/currencies";

const currencySchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  symbol: z.string().optional(),
  value: z.number().optional(),
});

type Currency = z.infer<typeof currencySchema>;

class UpdateCurrency {
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
        response: { error: "A moeda mão possue cadastro." },
      };
    }

    const hasName = currency.name ? { name: currency.name } : {};
    const hasDescription = currency.description
      ? { description: currency.description }
      : {};
    const hasSymbol = currency.symbol ? { symbol: currency.symbol } : {};
    const hasValue = currency.value ? { value: currency.value } : {};

    const currencyUpdate = await hasCurrencyRegistered.update({
      ...hasName,
      ...hasDescription,
      ...hasSymbol,
      ...hasValue,
    });

    return { status: 200, response: { data: currencyUpdate } };
  }
}

export default new UpdateCurrency();
