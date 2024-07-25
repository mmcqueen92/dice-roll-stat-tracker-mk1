import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DiceRollData from "../Interfaces/DiceRollData";

interface EditRollFormProps {
  roll: DiceRollData;
  onSave: (updatedRoll: DiceRollData) => void;
  onCancel: () => void;
}

const rollTypes = [
  "Attack",
  "Skill Check",
  "Saving Throw",
  "Attack/Spell Damage",
];

export default function EditDiceRollForm ({
  roll,
  onSave,
  onCancel,
}: EditRollFormProps) {
  const [formData, setFormData] = useState<DiceRollData>(roll);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      <DialogTitle>Edit Dice Roll</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Dice Size"
          type="number"
          name="diceSize"
          value={formData.diceSize}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Roll Value"
          type="number"
          name="rollValue"
          value={formData.rollValue}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          margin="dense"
          label="Roll Type"
          select
          name="rollType"
          value={formData.rollType}
          onChange={handleChange}
          fullWidth
          required
        >
          {rollTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Skill Type"
          type="text"
          name="skillType"
          value={formData.skillType}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Success"
          select
          name="success"
          value={formData.success}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="true">Success</MenuItem>
          <MenuItem value="false">Failure</MenuItem>
        </TextField>
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
};