import { socketIo } from "./app";

interface User {
  username: string;
  token: string;
  socketId: string;
}

const users: User[] = [];

socketIo.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("desconetou");
  });

  socket.on("logout", () => {
    const userDisconnect = users.findIndex(
      (item) => item.socketId === socket.id
    );
    if (userDisconnect !== -1) {
      users.slice(userDisconnect);
    }
  });

  socket.on("login", (data) => {
    const { username, token } = data;

    const userIsLogged = users?.find(
      (user) => user.username === username && user.token === token
    );

    if (userIsLogged) {
      return (userIsLogged.socketId = socket.id);
    }

    return users.push({
      username,
      token,
      socketId: socket.id,
    });
  });
});
