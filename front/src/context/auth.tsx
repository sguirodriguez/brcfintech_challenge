import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { constants } from "../utils/constants";

interface User {
  username: string;
  jwtToken: string;
}

interface AuthContextType {
  user: User | null;
  signed: boolean;
  signIn: () => Promise<{ data: boolean; error: boolean }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const handleSignIn = (): Promise<{
  data: {
    username: string;
    jwtToken: string;
  };
  error?: boolean;
}> => {
  return new Promise((resolve) => {
    resolve({
      data: {
        username: "Samuel Ribeiro",
        jwtToken: "219321hijsndu2ub23iu2j1b312321",
      },
    });
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signIn = async () => {
    setLoading(true);
    const { data, error } = await handleSignIn();
    setLoading(false);

    if (error) {
      localStorage.clear();
      return { data: false, error: true };
    }

    setUser(data);
    localStorage.setItem(constants.USER, JSON.stringify(data));
    window.location.href = "/dashboard";
    return { data: true, error: false };
  };

  const signOut = () => {
    setUser(null);
    localStorage.clear();
  };

  const loadStorageData = () => {
    setLoading(true);
    const storageUser = localStorage.getItem(constants.USER);
    setLoading(false);

    if (storageUser) {
      setUser(JSON.parse(storageUser));
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn, signOut }}>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "gray",
          }}
        >
          <div
            className="spinner-border text-light"
            role="status"
            style={{ width: 100, height: 100 }}
          />
        </div>
      ) : (
        children
      )}
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
