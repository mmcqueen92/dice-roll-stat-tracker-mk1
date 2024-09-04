import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CharacterData from "../Interfaces/CharacterData";

interface CharacterListProps {
  characters: CharacterData[];
  onEdit: (character: CharacterData) => void;
  onCreate: () => void;
}

export default function CharacterList({
  characters,
  onEdit,
  onCreate,
}: CharacterListProps) {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreate}
        style={{ marginBottom: "1rem" }}
      >
        Create New Character
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Character Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {characters.map((character) => (
              <TableRow key={character.characterId}>
                <TableCell>{character.name}</TableCell>
                <TableCell>{character.class}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(character)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
