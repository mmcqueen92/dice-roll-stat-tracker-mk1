import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const useRedirectIfUnauthenticated = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      console.log("UNAUTHENTICATED")
      navigate("/");
    }
  }, [authState.isAuthenticated, navigate]);
};
