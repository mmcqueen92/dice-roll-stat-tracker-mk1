import React, { useEffect, useState, useCallback } from "react";
import CharacterData from "../Interfaces/CharacterData";
import DiceRoll from "../Interfaces/DiceRoll";
import { useParams } from "react-router-dom";
import api from "../Utils/api";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";

import "../Styles/ActiveDashboard.css";

import DiceRollData from "../Interfaces/DiceRollData";

const skillChecks = [
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

const savingThrows = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

const diceSizes = [4, 6, 8, 10, 12, 20];

const initialFormData = {
  diceSize: 20,
  rollValue: "",
  rollType: "",
  skillType: "",
  success: null as boolean | null,
};

export default function ActiveDashboard() {
  const { id } = useParams<{ id: string }>();
  const activeCharacterId = parseInt(id || "0", 10);
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [diceRolls, setDiceRolls] = useState<DiceRollData[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [rollValues, setRollValues] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // const fetchCharacter = useCallback(async () => {
  //   try {
  //     const response = await api.get(`/character/${activeCharacterId}`);
  //     setCharacter(response.data);
  //   } catch (error) {
  //     console.error("Error fetching character", error);
  //   }
  // }, [activeCharacterId]);

  // const fetchDiceRolls = useCallback(async () => {
  //   try {
  //     const response = await api.get<DiceRollData[]>(
  //       `/diceroll/${activeCharacterId}`,
  //       {
  //         params: {
  //           skip: (page - 1) * pageSize,
  //           limit: pageSize,
  //         },
  //       }
  //     );
  //     response.data.forEach((roll) => delete roll.character)
  //     setDiceRolls(response.data);
  //   } catch (error) {
  //     console.error("Error fetching character dice rolls", error);
  //   }
  // }, [activeCharacterId]);

  useEffect(() => {
    if (!activeCharacterId) return;

    const fetchCharacter = async () => {
      try {
        const response = await api.get(`/character/${activeCharacterId}`);
        setCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character", error);
      }
    };

    const fetchDiceRolls = async () => {
      try {
        const response = await api.get<DiceRollData[]>(
          `/diceroll/${activeCharacterId}`,
          {
            params: {
              skip: (page - 1) * pageSize,
              limit: pageSize,
            },
          }
        );
        response.data.forEach((roll) => delete roll.character);
        setDiceRolls(response.data);

        const countResponse = await api.get<number>(
          `/diceroll/${activeCharacterId}/count`
        );
        setTotalRecords(countResponse.data);
      } catch (error) {
        console.error("Error fetching character dice rolls", error);
      }
    };
    fetchCharacter();
    fetchDiceRolls();
  }, [page, pageSize, activeCharacterId, formData]);

  // useEffect(() => {
  //   if (!activeCharacterId) return;

  //   fetchCharacter();
  //   fetchDiceRolls();
  // }, [activeCharacterId, fetchCharacter, fetchDiceRolls]);

  useEffect(() => {
    const values = Array.from({ length: formData.diceSize }, (_, i) => i + 1);
    setRollValues(values);
    setFormData((prevData) => ({ ...prevData, rollValue: "" }));
  }, [formData.diceSize]);

  useEffect(() => {
    if (formData.rollType === "Attack/Spell Damage") {
      setFormData((prevData) => ({ ...prevData, success: null }));
    }
  }, [formData.rollType]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => {
    if ("target" in e && "type" in e.target) {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else if (type === "number") {
        setFormData({
          ...formData,
          [name]: Number(value),
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      const { name, value } = e.target as { name: string; value: any };
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { rollType, success, ...rest } = formData;

    const dataToSubmit = {
      ...rest,
      rollType,
      success:
        rollType === "Attack/Spell Damage" ? null : success ? true : false,
      characterId: activeCharacterId,
    };

    try {
      await api.post("/diceroll/create", dataToSubmit);

      setFormData(initialFormData);

      // fetchDiceRolls();
    } catch (error) {
      console.error("There was an error creating the dice roll!", error);
    }
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page on page size change
  };

  return (
    <div>
      <h3>{character.name}</h3>
      <form onSubmit={handleSubmit} className="new-diceroll-form">
        <FormControl
          fullWidth
          margin="normal"
          className="new-diceroll-form-control"
        >
          <InputLabel id="dice-size-label">Dice Size</InputLabel>
          <Select
            labelId="dice-size-label"
            name="diceSize"
            value={formData.diceSize}
            onChange={handleChange}
            required
            className="new-diceroll-form-select"
            label="Dice Size"
          >
            {diceSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="normal"
          className="new-diceroll-form-control"
        >
          <InputLabel id="roll-type-label">Roll Type</InputLabel>
          <Select
            labelId="roll-type-label"
            name="rollType"
            value={formData.rollType}
            onChange={handleChange}
            className="new-diceroll-form-select"
            label="Roll Type"
            required
          >
            <MenuItem value="">Select Roll Type</MenuItem>
            <MenuItem value="Attack">Attack</MenuItem>
            <MenuItem value="Skill Check">Skill Check</MenuItem>
            <MenuItem value="Saving Throw">Saving Throw</MenuItem>
            <MenuItem value="Attack/Spell Damage">Attack/Spell Damage</MenuItem>
          </Select>
        </FormControl>

        {formData.rollType === "Skill Check" && (
          <FormControl
            fullWidth
            margin="normal"
            className="new-diceroll-form-control"
          >
            <InputLabel id="skill-type-label">Skill Type</InputLabel>
            <Select
              labelId="skill-type-label"
              name="skillType"
              value={formData.skillType}
              onChange={handleChange}
              className="new-diceroll-form-select"
            >
              <MenuItem value="">Select Skill Type</MenuItem>
              {skillChecks.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formData.rollType === "Saving Throw" && (
          <FormControl
            fullWidth
            margin="normal"
            className="new-diceroll-form-control"
          >
            <InputLabel id="saving-attribute-label">
              Saving Attribute
            </InputLabel>
            <Select
              labelId="saving-attribute-label"
              name="skillType"
              value={formData.skillType}
              onChange={handleChange}
              className="new-diceroll-form-select"
            >
              <MenuItem value="">Select Saving Attribute</MenuItem>
              {savingThrows.map((throwType) => (
                <MenuItem key={throwType} value={throwType}>
                  {throwType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl
          fullWidth
          margin="normal"
          className="new-diceroll-form-control"
        >
          <InputLabel id="roll-value-label">Roll Value</InputLabel>
          <Select
            labelId="roll-value-label"
            name="rollValue"
            value={formData.rollValue}
            onChange={handleChange}
            className="new-diceroll-form-select"
            required
            label="Roll Value"
          >
            <MenuItem value="">Select Roll Value</MenuItem>
            {rollValues.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.rollType !== "Attack/Spell Damage" && (
          <FormControlLabel
            control={
              <Checkbox
                name="success"
                checked={formData.success || false}
                onChange={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    success:
                      prevData.success === null ? false : !prevData.success,
                  }))
                }
              />
            }
            label="Success"
          />
        )}

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
      <h3>Recent Rolls</h3>
      <ul>
        {diceRolls.map((roll: any) => (
          <li key={roll.diceRollId}>
            {roll.rollType}
            {(roll.rollType === "Skill Check" ||
              roll.rollType === "Saving Throw") && <> ({roll.skillType}) </>}
            - {roll.rollValue} / {roll.diceSize}
            {roll.success === true && " - Success"}
            {roll.success === false && " - Fail"}
          </li>
        ))}
      </ul>

      {totalRecords > 0 && (
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span>
            Page: {page} of {Math.ceil(totalRecords / pageSize)}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalRecords}
          >
            Next
          </button>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
}
