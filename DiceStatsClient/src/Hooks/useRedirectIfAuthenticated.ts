import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const useRedirectIfAuthenticated = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/user-dashboard"); // Redirect to dashboard if already logged in
    }
  }, [authState.isAuthenticated, navigate]);
};
