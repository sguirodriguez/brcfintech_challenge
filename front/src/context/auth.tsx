import { ReactNode, createContext, useContext, useState } from "react";
import useSocket from "hooks/socket";
interface User {
  username: string;
  jwtToken: string;
}
interface AuthContextType {
  user: User | null;
  signIn: (value: string) => Promise<{ data: boolean; error: boolean }>;
  signOut: () => void;
  socketInstance: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const handleSignIn = (
  username: string
): {
  data: {
    username: string;
    jwtToken: string;
  };
  error?: boolean;
} => {
  return {
    data: {
      username: "Samuel Ribeiro",
      jwtToken: "219321hijsndu2ub23iu2j1b312321",
    },
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { socketInstance } = useSocket();
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (username: string) => {
    const { data, error } = await handleSignIn(username);

    if (error) {
      setUser(null);
      return { data: false, error: true };
    }

    setUser(data);
    return { data: true, error: false };
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, socketInstance }}>
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
