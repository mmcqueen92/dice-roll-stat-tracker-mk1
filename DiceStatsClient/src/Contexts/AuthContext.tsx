// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("DiceStatsToken");
    if (token) {
      setAuthState({
        isAuthenticated: true,
        token,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/user/login",
        { email, password }
      );
      decodeToken(response.data.token);
      const token = response.data.token;
      localStorage.setItem("DiceStatsToken", token);
      setAuthState({
        isAuthenticated: true,
        token,
      });
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("DiceStatsToken");
    setAuthState({
      isAuthenticated: false,
      token: null,
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
