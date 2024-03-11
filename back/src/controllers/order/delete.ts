import Orders from "../../database/models/orders";

class DeleteOrder {
  async execute(orderId: number) {
    const order = await Orders.findByPk(orderId);

    if (!order) {
      return {
        status: 500,
        response: {
          error: "Ordem não encontrada",
        },
      };
    }

    order.destroy();

    return {
      status: 200,
      response: {
        data: true,
      },
    };
  }
}

export default new DeleteOrder();
