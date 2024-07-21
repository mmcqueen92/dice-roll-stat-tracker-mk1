import React, { useEffect, useState } from "react";
import axios from "axios";
import NewDiceRollForm from "../Components/NewDiceRollForm";
import ActiveDashboardProps from "../Interfaces/ActiveDashboardProps";
import Character from "../Interfaces/Character"
import DiceRoll from "../Interfaces/DiceRoll";
export default function ActiveDashboard({ activeCharacterId }: ActiveDashboardProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `/api/characters/${activeCharacterId}`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDiceRolls = async () => {
      try {
        const response = await axios.get(
          `/api/dice-rolls?characterId=${activeCharacterId}`
        );
        setDiceRolls(response.data.slice(0, 5)); // Get the latest 5 rolls
      } catch (error) {
        console.error(error);
      }
    };

    if (activeCharacterId) {
      fetchCharacter();
      fetchDiceRolls();
    }
  }, [activeCharacterId]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Active Dashboard</h2>
      <h3>Character: {character.name}</h3>
      <NewDiceRollForm characterId={activeCharacterId} />
      <h3>Recent Rolls</h3>
      <ul>
        {diceRolls.map((roll: any) => (
          <li key={roll.id}>
            {roll.rollValue} ({roll.diceType}) -{" "}
            {roll.success ? "Success" : "Fail"}
          </li>
        ))}
      </ul>
    </div>
  );
};
