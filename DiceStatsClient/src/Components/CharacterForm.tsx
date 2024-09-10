import React, { useState } from "react";
import {
  TextField,
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import CharacterData from "../Interfaces/CharacterData";

interface CharacterFormProps {
  initialData: CharacterData;
  onSave: (character: CharacterData) => void;
  onCancel: () => void;
}

const classOptions = [
  "Fighter",
  "Wizard",
  "Cleric",
  "Rogue",
  "Paladin",
  "Ranger",
  "Druid",
  "Sorcerer",
  "Bard",
  "Barbarian",
  "Monk",
  "Warlock",
];

export default function CharacterForm({
  initialData,
  onSave,
  onCancel,
}: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterData>(initialData);
  const [secondaryClassOptions, setSecondaryClassOptions] =
    useState<string[]>(classOptions);

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Handle removal of primary class from secondary dropdown
    if (name === "class") {
      const filteredOptions = classOptions.filter((option) => option !== value);
      setSecondaryClassOptions(filteredOptions);
      setFormData((prev) => ({ ...prev, secondaryClass: "" })); // Reset secondary class
    }
  };

  // Type-specific handler for text inputs
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleTextChange}
          fullWidth
          required
        />

        {/* Primary Class Dropdown */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Class</InputLabel>
          <Select
            label="Class"
            name="class"
            value={formData.class}
            onChange={handleSelectChange}
            required
          >
            {classOptions
              .sort((a, b) => a.localeCompare(b))
              .map((classOption) => (
                <MenuItem key={classOption} value={classOption}>
                  {classOption}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Secondary Class Dropdown */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Secondary Class</InputLabel>
          <Select
            label="Secondary Class"
            name="secondaryClass"
            value={formData.secondaryClass}
            onChange={handleSelectChange}
            disabled={!formData.class} // Disable until primary class is selected
          >
            {secondaryClassOptions.map((classOption) => (
              <MenuItem key={classOption} value={classOption}>
                {classOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
