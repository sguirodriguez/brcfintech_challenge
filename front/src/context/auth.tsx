import { ReactNode, createContext, useContext } from "react";
import useSocket from "hooks/socket";
import request from "utils/request/request";
import { Socket } from "socket.io-client";

interface User {
  username: string;
  token: string;
}
interface AuthContextType {
  signIn: (value: string) => Promise<{
    data?: User;
    error?: boolean;
  }>;
  signOut: ({ username, token }: { username: string; token: string }) => void;
  socketInstance: Socket<any, any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { socketInstance } = useSocket();

  const signIn = async (username: string) => {
    const { data, error } = await request({
      method: "POST",
      path: "/login",
      body: {
        username,
      },
    });

    if (error) {
      return { error: true };
    }

    socketInstance.emit("login", {
      username: data.username,
      token: data.token,
    });

    return { data: data as User };
  };

  const signOut = ({ username, token }) => {
    socketInstance.emit("logout", {
      username,
      token,
    });
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, socketInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
