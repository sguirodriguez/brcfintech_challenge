import { io } from "socket.io-client";

export const socket = (token?: string) =>
  io("http://localhost:3333", {
    extraHeaders: {
      authorization: token,
    },
  });
