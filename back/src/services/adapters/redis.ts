import makerOrder from "../../controllers/order/makerOrder";
import completeOrder from "../../controllers/order/completeOrder";
import { redis } from "../../websocket";
import { socketIo } from "../../app";

async function addToOrderQueue({
  amount,
  coin,
  type,
  userId,
  typeFunction,
  orderId,
}: {
  amount: number;
  coin: "BTC" | "USD";
  type: "buy" | "sell";
  userId: number;
  typeFunction: "make" | "complete";
  orderId?: number;
}) {
  try {
    const jsonData = JSON.stringify({
      amount,
      coin,
      type,
      userId,
      typeFunction,
      orderId: orderId ? orderId : null,
    });

    await redis.lpush("order_queue", jsonData);
    console.log("Pedido adicionado à fila:", { amount, coin, type, userId });
  } catch (error) {
    console.error("Erro ao adicionar pedido à fila:", error);
  }
}

async function processOrderQueue(socket: any) {
  try {
    while (true) {
      const item = await redis.rpop("order_queue");

      if (item) {
        const info = JSON.parse(item);

        await createOrMakeOrder({ ...info });

        console.log("Pedido processado:", info);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } catch (error) {
    console.error("Erro ao processar a fila de pedidos:", error);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    processOrderQueue(socket);
  }
}

async function createOrMakeOrder({
  amount,
  coin,
  type,
  userId,
  typeFunction,
  orderId,
}: {
  amount: number;
  coin: "BTC" | "USD";
  type: "buy" | "sell";
  userId: number;
  typeFunction: "make" | "complete";
  orderId?: number;
}) {
  if (typeFunction === "make") {
    const { response } = await makerOrder.execute({
      amount,
      coin,
      type,
      userId,
    });
    socketIo.emit("repeat_get_all_orders");
    socketIo.emit("repeat_get_my_orders");
    socketIo.emit("repeat_get_transactions");
    socketIo.emit("repeat_get_balances");
    socketIo.emit("make_order_executed", {
      data: response?.data,
      error: response?.error,
    });
    return;
  }

  if (!orderId) {
    return socketIo.emit("get_response_completed_order", {
      data: false,
      error: true,
    });
  }

  const { response } = await completeOrder.execute({
    amount,
    coin,
    type,
    userId,
    orderId,
  });
  socketIo.emit("repeat_get_all_orders");
  socketIo.emit("repeat_get_my_orders");
  socketIo.emit("repeat_get_transactions");
  socketIo.emit("repeat_get_balances");
  socketIo.emit("get_response_completed_order", {
    data: response?.data,
    error: response?.error,
  });
}

export default { addToOrderQueue, processOrderQueue };
