import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import SmallContent from "../Components/SmallContent";
import { TextField, Button } from "@mui/material";
import { useRedirectIfAuthenticated } from "../Hooks/useRedirectIfAuthenticated";

export default function Login() {
  useRedirectIfAuthenticated();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      // Redirect or show success message
    } catch (error) {
      console.error("Login failed", error);
      // Handle error
    }
  };

  return (
    <SmallContent>
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          fullWidth
          required
          variant="filled"
          sx={{ backgroundColor: "#e0e0e0" }}
        />
        <TextField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Password"
          variant="filled"
          fullWidth
          required
          sx={{ backgroundColor: "#e0e0e0" }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </SmallContent>
  );
}
