import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
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
      <Button variant="contained" color="primary" onClick={onCreate}>
        Create New Character
      </Button>
      <List>
        {characters.map((character) => (
          <ListItem key={character.characterId}>
            <ListItemText
              primary={character.name}
              secondary={character.class}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onEdit(character)}>
                Edit
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
}
