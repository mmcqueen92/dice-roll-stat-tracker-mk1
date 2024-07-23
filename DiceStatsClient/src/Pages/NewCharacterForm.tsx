import React, { useState } from "react";
import api from "../Utils/api";
import { useNavigate } from "react-router-dom";

export default function NewCharacterForm() {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/Character", {
        ...formData,
      });

      if (response.status === 201) {
        // Redirect to UserDashboard or display a success message
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Error creating character:", error);
    }
  };

  return (
    <div>
      <h2>Create New Character</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Class:
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {/* Add other fields as necessary */}
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
}
