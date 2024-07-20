import React, { useState } from 'react';
import axios from 'axios';
import DiceRollData from '../Interfaces/DiceRollData';

const initialFormData: DiceRollData = {
  characterId: 1,
  diceSize: 20,
  rollValue: 10,
  rollType: "",
  skillType: "",
  success: false,
};

export default function NewDiceRollForm() {
    const [formData, setFormData] = useState<DiceRollData>(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5050/api/diceroll/create', formData);
            console.log('Dice roll created:', response.data);
            // Reset the form or handle the response as needed
        } catch (error) {
            console.error('There was an error creating the dice roll!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>New DiceRoll Form</h1>

            <div>
                <label>Character ID:</label>
                <input
                    type="number"
                    name="characterId"
                    value={formData.characterId}
                    onChange={handleChange}
                    required
                />
            </div>

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
                <input
                    type="text"
                    name="rollType"
                    value={formData.rollType}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Skill Type:</label>
                <input
                    type="text"
                    name="skillType"
                    value={formData.skillType}
                    onChange={handleChange}
                />
            </div>

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
                    onChange={() => setFormData({ ...formData, success: !formData.success })}
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}
