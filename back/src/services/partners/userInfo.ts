import { Response } from "express";
import Users from "../../database/models/users";
import { Socket } from "socket.io";

const getUserInfoByToken = async (
  auth: string,
  response: Response
): Promise<any> => {
  if (!auth) {
    return response
      .status(401)
      .json({ error: "Erro ao autenticar, faça login novamente." });
  }

  const token = auth?.split(" ");

  if (!token?.[1]) {
    return response
      .status(401)
      .json({ error: "Erro ao autenticar, faça login novamente." });
  }

  const user = await Users.findOne({
    where: {
      token: token?.[1],
    },
  });

  if (!user) {
    return response.status(500).json({ error: "Erro ao encontrar usuário." });
  }

  return user;
};

const getUserInfoSocket = async (
  auth: string,
  socket: Socket,
  emitString: string
): Promise<any> => {
  const token = auth?.split(" ");

  if (!token || !token?.[1]) {
    return socket.emit(emitString, {
      error: "Não foi possível encontrar o usuário.",
    });
  }

  const user = await Users.findOne({
    where: {
      token: token?.[1],
    },
  });

  if (!user) {
    return socket.emit(emitString, {
      error: "Não foi possível encontrar o usuário.",
    });
  }

  return user;
};

export default { getUserInfoByToken, getUserInfoSocket };
