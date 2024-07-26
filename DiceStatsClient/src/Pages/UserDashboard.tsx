import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import { Link } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";
import CharacterData from "../Interfaces/CharacterData";
import { Dialog } from "@mui/material";
import CharacterForm from "../Components/CharacterForm";

export default function UserDashboard() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedActiveCharacterId = localStorage.getItem("activeCharacterId");
    if (savedActiveCharacterId) {
      setActiveCharacterId(parseInt(savedActiveCharacterId, 10));
    }

    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("DiceStatsToken");
        if (token) {
          const decodedToken = decodeToken(token);
          const userId = decodedToken.id;
          const response = await api.get<CharacterData[]>(
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

  useEffect(() => {
    // Update localStorage whenever activeCharacterId changes
    if (activeCharacterId !== null) {
      localStorage.setItem("activeCharacterId", activeCharacterId.toString());
    }
  }, [activeCharacterId]);

  const handleSetActiveCharacter = (characterId: number) => {
    setActiveCharacterId(characterId);
    // Save active character to state or context
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (character: CharacterData) => {
    // Save the character (create or update) to the server
    // Example: saveCharacter(character).then(fetchCharacters).then(setCharacters);
    try {
      
        // Create new character
        const { characterId, ...characterData } = character; // Destructure and remove characterId
        const response = await api.post("/character", characterData);
        setCharacters((prevCharacters) => [...prevCharacters, response.data]);
      
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error saving character", e);
    }
    
    
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
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
                {character.name} - {character.class}
                {character.characterId === activeCharacterId && (
                  <span> (Active)</span>
                )}
                {character.characterId !== activeCharacterId && (
                  <button
                    onClick={() =>
                      handleSetActiveCharacter(character.characterId)
                    }
                  >
                    Set Active
                  </button>
                )}
                <Link to={`/character-rolls/${character.characterId}`}>
                  View Rolls
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link to={`/active-dashboard/${activeCharacterId}`}>Start Rolling</Link>
      {/* <Link to="/characters/new">Create New Character</Link> */}
      <button onClick={handleCreate}>Create New Character</button>
      <Link to="/character-management">Manage Characters</Link>
      <Link to="/stats">View Stats</Link>
      <Dialog open={isModalOpen} onClose={handleCancel}>
        <CharacterForm
          initialData={
            { characterId: 0, name: "", class: "" }
          } // Add other default fields as needed
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Dialog>
    </div>
  );
}
