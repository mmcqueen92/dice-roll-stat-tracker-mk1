import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ViewCharacterRolls from "./Pages/ViewCharacterRolls";
import UserDashboard from "./Pages/UserDashboard";
import ActiveDashboard from "./Pages/ActiveDashboard";
import NewCharacterForm from "./Pages/NewCharacterForm";
import { AuthProvider } from "./Contexts/AuthContext";
import CharacterManagement from "./Pages/CharacterManagement";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/character-rolls/:id"
            element={<ViewCharacterRolls />}
          />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/characters/new" element={<NewCharacterForm />} />
          <Route path="/active-dashboard/:id" element={<ActiveDashboard />} />
          <Route path="/character-management" element={<CharacterManagement />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
