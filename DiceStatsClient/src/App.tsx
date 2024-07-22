import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ViewCharacterRolls from "./Pages/ViewCharacterRolls";
import { AuthProvider } from "./Contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/characters/:id/rolls"
            element={<ViewCharacterRolls />}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
