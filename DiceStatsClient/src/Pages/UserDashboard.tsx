import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import { Link } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";
import Character from "../Interfaces/Character";

export default function UserDashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("DiceStatsToken");
        if (token) {
          const decodedToken = decodeToken(token);
          const userId = decodedToken.id;
          const response = await api.get<Character[]>(
            `/Character?userId=${userId}`
          );
          setCharacters(response.data);
        } else {
          setError("No token found");
        }
      } catch (error) {
        setError("Error fetching characters");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleSetActiveCharacter = (characterId: number) => {
    setActiveCharacterId(characterId);
    // Save active character to state or context
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <h3>Your Characters</h3>
      {loading && <p>Loading characters...</p>}
      {error && <p>{error}</p>}
      {characters.length === 0 && !loading && !error && (
        <p>No characters found.</p>
      )}
      {characters.length > 0 && (
        <ul>
          {characters.map((character) => {
            return (
              <li key={character.characterId}>
                {character.name}
                {character.characterId === activeCharacterId && <span> (Active)</span>}
                <button
                  onClick={() =>
                    handleSetActiveCharacter(character.characterId)
                  }
                >
                  Set Active
                </button>
                <Link to={`/characters/${character.characterId}/rolls`}>
                  View Rolls
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link to={`/active-dashboard/${activeCharacterId}`}>Start Rolling</Link>
      <Link to="/characters/new">Create New Character</Link>
      <Link to="/stats">View Stats</Link>
    </div>
  );
}
