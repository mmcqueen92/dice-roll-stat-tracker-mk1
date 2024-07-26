import React, { useState } from "react";
import {
  TextField,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CharacterData from "../Interfaces/CharacterData";


interface CharacterFormProps {
  initialData: CharacterData;
  onSave: (character: CharacterData) => void;
  onCancel: () => void;
}

export default function CharacterForm({
  initialData,
  onSave,
  onCancel,
}: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {formData.characterId ? "Edit Character" : "Create New Character"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Class"
          type="text"
          name="class"
          value={formData.class}
          onChange={handleChange}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
}
