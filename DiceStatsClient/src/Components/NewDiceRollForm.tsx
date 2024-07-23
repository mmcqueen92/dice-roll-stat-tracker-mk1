import React, { useState } from "react";
import api from "../Utils/api";
import DiceRollData from "../Interfaces/DiceRollData";
import NewDiceRollFormProps from "../Interfaces/NewDiceRollFormProps";

const initialFormData: DiceRollData = {
  diceSize: 20,
  rollValue: 10,
  rollType: "",
  skillType: "",
  success: false,
};

export default function NewDiceRollForm({ characterId }: NewDiceRollFormProps) {
  const [formData, setFormData] = useState<DiceRollData>(initialFormData);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    // For checkbox inputs
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

    // Add characterId to the formData
    const dataToSubmit: DiceRollData = {
      ...formData,
      characterId,
    };

    try {
      console.log("DATA: ", dataToSubmit);
      const response = await api.post("/diceroll/create", dataToSubmit);
      console.log("Dice roll created:", response.data);
      // Reset the form or handle the response as needed
    } catch (error) {
      console.error("There was an error creating the dice roll!", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>New DiceRoll Form</h1>

      <div>
        <label>Dice Size:</label>
        <input
          type="number"
          name="diceSize"
          value={formData.diceSize}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Roll Type:</label>
        <select
          name="rollType"
          value={formData.rollType}
          onChange={handleChange}
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
        <input
          type="number"
          name="rollValue"
          value={formData.rollValue}
          onChange={handleChange}
          required
        />
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
  );
}
