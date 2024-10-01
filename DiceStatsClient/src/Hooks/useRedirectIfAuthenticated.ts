import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const useRedirectIfAuthenticated = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      console.log("AUTHENTICATED")
      navigate("/user-dashboard");
    }
  }, [authState.isAuthenticated, navigate]);
};
