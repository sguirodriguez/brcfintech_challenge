import Currencies from "../../database/models/currencies";

class EchangeRate {
  async execute() {
    const bitcoinInfo = await Currencies.findOne({
      where: {
        symbol: "BTC",
      },
    });

    const usdInfo = await Currencies.findOne({
      where: {
        symbol: "USD",
      },
    });

    if (!bitcoinInfo || !usdInfo) {
      return {
        status: 500,
        response: {
          error: "Moedas não encontradas.",
        },
      };
    }

    const usdToBitcoinRate = Number(bitcoinInfo.value) / Number(usdInfo.value);
    const bitcoinToUsdRate = Number(usdInfo.value) / Number(bitcoinInfo.value);

    return {
      status: 200,
      response: {
        data: {
          usdToBitcoinRate,
          bitcoinToUsdRate,
        },
      },
    };
  }
}

export default new EchangeRate();
