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
import { Delete } from "@mui/icons-material";
import CharacterData from "../Interfaces/CharacterData";

interface CharacterListProps {
  characters: CharacterData[];
  onEdit: (character: CharacterData) => void;
  onCreate: () => void;
  onDelete: (character: CharacterData) => void;
}

export default function CharacterList({
  characters,
  onEdit,
  onCreate,
  onDelete
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
      <TableContainer component={Paper} sx={{ backgroundColor: "#e0e0e0" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <h4>Character Name</h4>
              </TableCell>
              <TableCell>
                <h4>Class</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Edit</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Delete</h4>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {characters.map((character) => (
              <TableRow key={character.characterId}>
                <TableCell>{character.name}</TableCell>
                <TableCell>
                  {character.class}
                  {character.secondaryClass
                    ? `/${character.secondaryClass}`
                    : ""}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(character)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onDelete(character)}>
                    <Delete></Delete>
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
