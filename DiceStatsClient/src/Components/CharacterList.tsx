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
              <TableCell>
                <h4>Character Name</h4>
              </TableCell>
              <TableCell>
                <h4>Class</h4>
              </TableCell>
              <TableCell align="right">
                <h4>Actions</h4>
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
