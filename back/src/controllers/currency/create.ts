import { z } from "zod";
import Currencies from "../../database/models/currencies";

const currencySchema = z.object({
  name: z.string().min(3, { message: "O nome precisa de 3 carateres." }),
  description: z.string().optional(),
  symbol: z
    .string()
    .min(3, { message: "O símbolo da moeda precisa de 3 carateres." }),
  value: z.number().min(1, { message: "Valor precisa ser maior que zero." }),
});

type Currency = z.infer<typeof currencySchema>;

class CreateCurrency {
  async execute(currency: Currency) {
    const validate = currencySchema.safeParse(currency);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const hasCurrencyRegistered = await Currencies.findAll({
      where: {
        name: currency.name,
        symbol: currency.symbol,
      },
    });

    if (hasCurrencyRegistered.length > 0) {
      return {
        status: 409,
        response: { error: "A moeda já possui cadastro." },
      };
    }

    const registerCurrency = await Currencies.create({
      name: currency.name,
      description: currency.description,
      symbol: currency.symbol,
      value: currency.value,
    });

    return { status: 200, response: { data: registerCurrency } };
  }
}

export default new CreateCurrency();
