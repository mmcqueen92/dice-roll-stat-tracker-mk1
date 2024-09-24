import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, IconButton, Paper, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CharacterList from "../Components/CharacterList";
import CharacterForm from "../Components/CharacterForm";
import CharacterData from "../Interfaces/CharacterData";
import api from "../Utils/api";

import "../Styles/CharacterManagement.css";
import PageContent from "../Components/PageContent";

export default function CharacterManagement() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [editChar, setEditChar] = useState(false);
  const [newChar, setNewChar] = useState(false);

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
    setEditChar(true);
  };

  const handleCreate = () => {
    setSelectedCharacter(null);
    setNewChar(true);
  };

  const handleSave = async (character: CharacterData) => {
    try {
      if (character.characterId === 0) {
        const { characterId, ...characterData } = character;
        const response = await api.post("/character", characterData);
        setCharacters((prevCharacters) => [...prevCharacters, response.data]);
      } else {
        await api.put(`/character/${character.characterId}`, character);
        setCharacters((prevCharacters) =>
          prevCharacters.map((char) =>
            char.characterId === character.characterId ? character : char
          )
        );
      }
      setEditChar(false);
      setNewChar(false);
    } catch (e) {
      console.error("Error saving character", e);
    }
  };

  const handleCancelEdit = () => {
    setEditChar(false);
  };

  const handleCancelCreate = () => {
    setNewChar(false);
  };

  return (
    <PageContent>
      <h3>Manage Characters</h3>
      <CharacterList
        characters={characters}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
      <Dialog open={newChar} onClose={handleCancelCreate}>
        <DialogTitle>
          <span>Create New Character</span>
          <IconButton
            aria-label="close"
            onClick={handleCancelCreate}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <CharacterForm
          initialData={{
            characterId: 0,
            name: "",
            class: "",
            secondaryClass: "",
          }}
          onSave={handleSave}
          onCancel={handleCancelCreate}
        />
      </Dialog>
      <Dialog open={editChar} onClose={handleCancelEdit}>
        <DialogTitle>
          <span>Edit Character</span>
          <IconButton
            aria-label="close"
            onClick={handleCancelEdit}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <CharacterForm
          initialData={
            selectedCharacter || {
              characterId: 0,
              name: "",
              class: "",
              secondaryClass: "",
            }
          }
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      </Dialog>
    </PageContent>
  );
}
