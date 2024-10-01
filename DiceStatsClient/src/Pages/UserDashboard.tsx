import React, { useEffect, useState } from "react";
import api from "../Utils/api";
import "../Styles/UserDashboard.css";
import { Link } from "react-router-dom";
import { decodeToken } from "../Utils/jwt";
import CharacterData from "../Interfaces/CharacterData";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CharacterForm from "../Components/CharacterForm";
import PageContent from "../Components/PageContent";
import { useRedirectIfUnauthenticated } from "../Hooks/useRedirectIfUnauthenticated";

export default function UserDashboard() {
  useRedirectIfUnauthenticated();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
    <PageContent>
      <h2>User Dashboard</h2>
      {loading && <p>Loading characters...</p>}
      {error && <p>{error}</p>}
      {characters.length === 0 && !loading && !error && (
        <p>No characters found.</p>
      )}
      {characters.length > 0 && (
        <TableContainer component={Paper} className="table-container" sx={{backgroundColor: "#e0e0e0"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <h4>Character Name</h4>
                </TableCell>
                <TableCell align="center">
                  <h4>Class</h4>
                </TableCell>
                <TableCell align="center">
                  <h4>Actions</h4>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {characters.map((character) => (
                <TableRow key={character.characterId}>
                  <TableCell align="center">{character.name}</TableCell>
                  <TableCell align="center">
                    {character.class}
                    {character.secondaryClass
                      ? `/${character.secondaryClass}`
                      : ""}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/active-dashboard/${character.characterId}`}
                    >
                      Start Rolling
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div className="button-container">
        <Button variant="contained" onClick={handleCreate}>
          Create New Character
        </Button>
        <Button variant="contained" component={Link} to="/character-management">
          Manage Characters
        </Button>
        <Button variant="contained" component={Link} to="/stats">
          View Stats
        </Button>
      </div>
      <Dialog open={isModalOpen} onClose={handleCancel}>
        <DialogTitle>
          <span>Create New Character</span>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
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
          onCancel={handleCancel}
        />
      </Dialog>
    </PageContent>
  );
}
