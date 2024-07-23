import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";

export default function UserDashboard() {
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem("DiceStatsToken");

        const userId = token ? decodeToken(token) : null;
        const response = await axios.get("/api/characters");
        setCharacters(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCharacters();
  }, []);

  const handleSetActiveCharacter = (characterId: any) => {
    setActiveCharacterId(characterId);
    // Save active character to state or context
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Your Characters</h3>
      <ul>
        {characters.map((character: any) => (
          <li key={character.id}>
            {character.name}
            <button onClick={() => handleSetActiveCharacter(character.id)}>
              Set Active
            </button>
            <Link to={`/characters/${character.id}/rolls`}>View Rolls</Link>
          </li>
        ))}
      </ul>
      <Link to={`/active-dashboard/${activeCharacterId}`}>Start Rolling</Link>
      <Link to="/characters/new">Create New Character</Link>
      <Link to="/stats">View Stats</Link>
    </div>
  );
};
