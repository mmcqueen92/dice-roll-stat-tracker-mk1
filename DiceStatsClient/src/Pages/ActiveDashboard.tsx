import React, { useEffect, useState, useCallback } from "react";
import Character from "../Interfaces/Character";
import DiceRoll from "../Interfaces/DiceRoll";
import { useParams } from "react-router-dom";
import api from "../Utils/api";

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
  success: false,
};

export default function ActiveDashboard() {
  const { id } = useParams<{ id: string }>();
  const activeCharacterId = parseInt(id || "0", 10);
  const [character, setCharacter] = useState<Character | null>(null);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [rollValues, setRollValues] = useState<number[]>([]);

  const fetchCharacter = useCallback(async () => {
    try {
      const response = await api.get(`/character/${activeCharacterId}`);
      setCharacter(response.data);
    } catch (error) {
      console.error("Error fetching character", error);
    }
  }, [activeCharacterId]);

  const fetchDiceRolls = useCallback(async () => {
    try {
      const response = await api.get(`/diceroll/${activeCharacterId}`);
      console.log("DICE ROLLS: ", response.data);
      setDiceRolls(response.data);
    } catch (error) {
      console.error("Error fetching character dice rolls", error);
    }
  }, [activeCharacterId]);

  useEffect(() => {
    if (!activeCharacterId) return;

    fetchCharacter();
    fetchDiceRolls();
  }, [activeCharacterId, fetchCharacter, fetchDiceRolls]);

  useEffect(() => {
    // Update rollValues based on the selected dice size
    const values = Array.from({ length: formData.diceSize }, (_, i) => i + 1);
    setRollValues(values);
    // Reset rollValue when diceSize changes
    setFormData((prevData) => ({ ...prevData, rollValue: "" }));
  }, [formData.diceSize]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      characterId: activeCharacterId,
    };

    try {
      console.log("DATA: ", dataToSubmit);
      const response = await api.post("/diceroll/create", dataToSubmit);
      console.log("Dice roll created:", response.data);
      // Reset the form or handle the response as needed
      setFormData(initialFormData);
      // Fetch the updated dice rolls
      fetchDiceRolls();
    } catch (error) {
      console.error("There was an error creating the dice roll!", error);
    }
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Active Dashboard</h2>
      <h3>Character: {character.name}</h3>
      <form onSubmit={handleSubmit}>
        <h1>New DiceRoll Form</h1>

        <div>
          <label>Dice Size:</label>
          <select
            name="diceSize"
            value={formData.diceSize}
            onChange={handleChange}
            required
          >
            {diceSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Roll Type:</label>
          <select
            name="rollType"
            value={formData.rollType}
            onChange={handleChange}
            required
          >
            <option value="">Select Roll Type</option>
            <option value="Attack">Attack</option>
            <option value="Skill Check">Skill Check</option>
            <option value="Saving Throw">Saving Throw</option>
          </select>
        </div>

        {formData.rollType === "Skill Check" && (
          <div>
            <label>Skill Type:</label>
            <select
              name="skillType"
              value={formData.skillType}
              onChange={handleChange}
            >
              <option value="">Select Skill Type</option>
              {skillChecks.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.rollType === "Saving Throw" && (
          <div>
            <label>Saving Attribute:</label>
            <select
              name="skillType"
              value={formData.skillType}
              onChange={handleChange}
            >
              <option value="">Select Saving Attribute</option>
              {savingThrows.map((throwType) => (
                <option key={throwType} value={throwType}>
                  {throwType}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Roll Value:</label>
          <select
            name="rollValue"
            value={formData.rollValue}
            onChange={handleChange}
            required
          >
            <option value="">Select Roll Value</option>
            {rollValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Success:</label>
          <input
            type="checkbox"
            name="success"
            checked={formData.success}
            onChange={() =>
              setFormData({ ...formData, success: !formData.success })
            }
          />
        </div>

        <button type="submit">Submit</button>
      </form>
      <h3>Recent Rolls</h3>
      <ul>
        {diceRolls.map((roll: any) => (
          <li key={roll.diceRollId}>
            {roll.rollType} - {roll.rollValue} / {roll.diceSize} -{" "}
            {roll.success ? "Success" : "Fail"}
          </li>
        ))}
      </ul>
    </div>
  );
}
