import { ReactNode, createContext, useContext, useState } from "react";
import request from "utils/request/request";
import { socket } from "utils/socket/socket";
interface User {
  username: string;
  token: string;
}
interface AuthContextType {
  signIn: (value: string) => Promise<{
    data?: User;
    error?: boolean;
  }>;
  signOut: () => void;
  socketInstance: any;
  initializeSocket: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [socketInstance, setSocketInstance] = useState(null);

  const initializeSocket = (token: string) => {
    setSocketInstance(socket(token));
  };

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

    return { data: data as User };
  };

  const signOut = () => {};

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, socketInstance, initializeSocket }}
    >
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
