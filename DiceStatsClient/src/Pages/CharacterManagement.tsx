import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import CharacterList from "../Components/CharacterList";
import CharacterForm from "../Components/CharacterForm";
import CharacterData from "../Interfaces/CharacterData";
import api from "../Utils/api";

export default function CharacterManagement() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await api.get("/character");
        setCharacters(response.data);
      } catch (e) {
        console.error("Error fetching characters", e);
      }
    };
    fetchCharacters();
  }, []);

  const handleEdit = (character: CharacterData) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCharacter(null);
    setIsModalOpen(true);
  };

  const handleSave = async (character: CharacterData) => {
    try {
      if (character.characterId === 0) {
        const { characterId, ...characterData } = character;
        const response = await api.post("/character", characterData);
        setCharacters((prevCharacters) => [...prevCharacters, response.data]);
      } else {
        await api.put(
          `/character/${character.characterId}`,
          character
        );
        setCharacters((prevCharacters) =>
          prevCharacters.map((char) =>
            char.characterId === character.characterId ? character : char
          )
        );
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error saving character", e);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CharacterList
        characters={characters}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
      <Dialog open={isModalOpen} onClose={handleCancel}>
        <CharacterForm
          initialData={selectedCharacter || { characterId: 0, name: "", class: "" }} // Add other default fields as needed
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Dialog>
    </>
  );
}
