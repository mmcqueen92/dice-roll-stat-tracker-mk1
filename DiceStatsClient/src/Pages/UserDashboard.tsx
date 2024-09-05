import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import { Link } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";
import CharacterData from "../Interfaces/CharacterData";
import {
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
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
    if (activeCharacterId !== null) {
      localStorage.setItem("activeCharacterId", activeCharacterId.toString());
    }
  }, [activeCharacterId]);

  const handleSetActiveCharacter = (characterId: number) => {
    setActiveCharacterId(characterId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (character: CharacterData) => {
    try {
      const { characterId, ...characterData } = character;
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
      {/* <h3>Your Characters</h3> */}
      {loading && <p>Loading characters...</p>}
      {error && <p>{error}</p>}
      {characters.length === 0 && !loading && !error && (
        <p>No characters found.</p>
      )}
      {characters.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Character Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {characters.map((character) => (
                <TableRow key={character.characterId}>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.class}</TableCell>
                  <TableCell align="center">
                    {character.characterId === activeCharacterId ? (
                      <span>Active</span>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleSetActiveCharacter(character.characterId)
                        }
                      >
                        Set Active
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/character-rolls/${character.characterId}`}
                    >
                      View Rolls
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          style={{ marginRight: "10px" }}
        >
          Create New Character
        </Button>
        <Button
          variant="contained"
          component={Link}
          to={`/active-dashboard/${activeCharacterId}`}
          style={{ marginRight: "10px" }}
        >
          Start Rolling
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/character-management"
          style={{ marginRight: "10px" }}
        >
          Manage Characters
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/stats"
          style={{ marginRight: "10px" }}
        >
          View Stats
        </Button>
      </div>
      <Dialog open={isModalOpen} onClose={handleCancel}>
        <CharacterForm
          initialData={{ characterId: 0, name: "", class: "" }}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Dialog>
    </div>
  );
}
