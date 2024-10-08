import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import DiceRollData from "../Interfaces/DiceRollData";

interface EditRollFormProps {
  roll: DiceRollData;
  onSave: (updatedRoll: DiceRollData) => void;
  onCancel: () => void;
}

const rollTypes = [
  "Attack",
  "Ability/Skill Check",
  "Saving Throw",
  "Attack/Spell Damage",
];

const skills = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

const abilities = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

const skillsAndAbilities = [...skills, ...abilities].sort();

const diceSizes = [4, 6, 8, 10, 12, 20];

export default function EditDiceRollForm({
  roll,
  onSave,
  onCancel,
}: EditRollFormProps) {
  const [formData, setFormData] = useState<DiceRollData>(roll);
  const [availableRollValues, setAvailableRollValues] = useState<number[]>(
    Array.from({ length: 20 }, (_, i) => i + 1)
  );
  useEffect(() => {
    // Update available roll values based on selected dice size
    if (formData.diceSize) {
      setAvailableRollValues(
        Array.from({ length: formData.diceSize }, (_, i) => i + 1)
      );
    } else {
      setAvailableRollValues([]);
    }
  }, [formData.diceSize]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "success") {
      const boolValue = value === "true";

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: boolValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.rollType === "Attack/Spell Damage") {
      formData.success = null;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Edit Dice Roll</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="dice-size-label">Dice Size</InputLabel>
          <Select
            name="diceSize"
            value={formData.diceSize || ""}
            onChange={handleSelectChange}
            required
            labelId="dice-size-label"
            label="Dice Size"
          >
            {diceSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel id="roll-value-label">Roll Value</InputLabel>
          <Select
            name="rollValue"
            labelId="roll-value-label"
            label="Roll Value"
            value={formData.rollValue || ""}
            onChange={handleSelectChange}
            required
          >
            {availableRollValues.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Roll Type"
          select
          name="rollType"
          value={formData.rollType || ""}
          onChange={handleTextFieldChange}
          fullWidth
          required
        >
          {rollTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {formData.rollType === "Ability/Skill Check" && (
          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel id="skill-type-label">Skill Type</InputLabel>
            <Select
              labelId="skill-type-label"
              label="Skill Type"
              name="skillType"
              value={formData.skillType}
              onChange={handleSelectChange}
              className="new-diceroll-form-select"
            >
              <MenuItem value="">Select Skill Type</MenuItem>
              {skillsAndAbilities.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formData.rollType === "Saving Throw" && (
          <TextField
            margin="dense"
            label="Saving Throw"
            type="text"
            name="savingThrow"
            value={formData.skillType || ""}
            onChange={handleTextFieldChange}
            fullWidth
          />
        )}

        {formData.rollType !== "Attack/Spell Damage" && (
          <TextField
            margin="dense"
            label="Success"
            select
            name="success"
            value={formData.success || "false"}
            onChange={handleTextFieldChange}
            fullWidth
          >
            <MenuItem value="true">Success</MenuItem>
            <MenuItem value="false">Failure</MenuItem>
          </TextField>
        )}
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
