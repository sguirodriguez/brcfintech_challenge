import configuration from "./config";
import { server, socketIo } from "./app";
import "./websocket";
import redisAction from "./services/adapters/redis";

server.listen(configuration.port || 3333, async () => {
  console.log("running on port 3333");
});

redisAction.processOrderQueue(socketIo);

export default server;
