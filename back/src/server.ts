import configuration from "./config";
import { server } from "./app";
import "./websocket";

server.listen(configuration.port || 3333, async () => {
  console.log("running on port 3333");
});

export default server;
