import { z } from "zod";
import Orders from "../../database/models/orders";
import Currencies from "../../database/models/currencies";

const exchangeSchema = z.object({
  value: z.number(),
  coin: z.enum(["USD", "BTC"]),
  type: z.enum(["buy", "sell"]),
});

type ExchangeInfo = z.infer<typeof exchangeSchema>;
const MAKER_FEE = 5;
const TAKER_FEE = 3;
class CalculateEchange {
  async execute(exhangeInfo: ExchangeInfo) {
    const validate = exchangeSchema.safeParse(exhangeInfo);

    if (!validate.success) {
      return {
        status: 409,
        response: { error: validate.error.issues[0].message },
      };
    }

    const { data, error } = await this.findFee(exhangeInfo);

    if (error) {
      return {
        status: 500,
        response: { error },
      };
    }

    return {
      status: 200,
      response: { data: data },
    };
  }

  async findFee(values: {
    value: number;
    coin: "USD" | "BTC";
    type: "buy" | "sell";
  }) {
    let coinInfo;

    if (values?.coin === "BTC") {
      const bitcoin = await Currencies.findOne({
        where: {
          symbol: values.coin,
        },
      });

      if (!bitcoin) {
        return {
          error: "Moeda não encontrada.",
        };
      }

      coinInfo = bitcoin;
    }

    if (values?.coin === "USD") {
      const usd = await Currencies.findOne({
        where: {
          symbol: values.coin,
        },
      });

      if (!usd) {
        return {
          error: "Moeda não encontrada.",
        };
      }

      coinInfo = usd;
    }

    const typeOrder = values.type === "buy" ? "sell" : "buy";

    const findOrder = await Orders.findOne({
      where: {
        currencyId: coinInfo?.id,
        amount: values.value,
        type: typeOrder,
      },
    });

    if (!findOrder) {
      return {
        data: {
          value: this.calculateValueFee({
            value: values.value,
            coin: values.coin,
            fee: MAKER_FEE,
          }),
          fee: MAKER_FEE,
          coin: values.coin,
        },
      };
    }

    return {
      data: {
        value: this.calculateValueFee({
          value: values.value,
          coin: values.coin,
          fee: TAKER_FEE,
        }),
        fee: TAKER_FEE,
        coin: values.coin,
      },
    };
  }

  calculateValueFee({
    value,
    coin,
    fee,
  }: {
    value: number;
    coin: string;
    fee: number;
  }) {
    const valueFee = (fee * Number(value)) / 100;
    if (coin === "BTC") {
      return parseFloat(valueFee.toFixed(8));
    }

    return parseFloat(valueFee.toFixed(2));
  }
}

export default new CalculateEchange();
