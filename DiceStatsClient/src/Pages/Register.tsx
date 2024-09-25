import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageContent from "../Components/PageContent";
import SmallContent from "../Components/SmallContent";
import { TextField, Button } from "@mui/material";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5050/api/user/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      const { token } = response.data;
      localStorage.setItem("DiceStatsToken", token); // Save token to local storage
      navigate("/user-dashboard");
      // Redirect or show success message
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <SmallContent>
      <h2>Register</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          label="Username"
          variant="filled"
          sx={{ backgroundColor: "#e0e0e0" }}
          fullWidth
          required
        />
        <TextField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          variant="filled"
          sx={{ backgroundColor: "#e0e0e0" }}
          fullWidth
          required
        />
        <TextField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          label="Password"
          variant="filled"
          sx={{ backgroundColor: "#e0e0e0" }}
          fullWidth
          required
        />
        <TextField
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          label="Confirm Password"
          variant="filled"
          sx={{ backgroundColor: "#e0e0e0" }}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </SmallContent>
  );
}
