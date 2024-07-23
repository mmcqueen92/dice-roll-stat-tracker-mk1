import React, { useEffect, useState } from "react";
import NewDiceRollForm from "../Components/NewDiceRollForm";
import Character from "../Interfaces/Character"
// import DiceRoll from "../Interfaces/DiceRoll";
import { useParams } from "react-router-dom";
import api from "../Utils/api";

export default function ActiveDashboard() {
  const { id } = useParams<{ id: string }>();
  const activeCharacterId = parseInt(id || "0", 10);
  const [character, setCharacter] = useState<Character | null>(null);
  // const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);

  useEffect(() => {
    if (!activeCharacterId) return;

    const fetchCharacter = async () => {
      try {

        const response = await api.get(
          `/character/${activeCharacterId}`
        );
        setCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character", error);
      }
    };

    // const fetchDiceRolls = async () => {
    //   try {
    //     const response = await api.get(
    //       `/dice-rolls?characterId=${activeCharacterId}`
    //     );
    //     setDiceRolls(response.data.slice(0, 5)); // Get the latest 5 rolls
    //   } catch (error) {
    //     console.error("Error fetching character dice rolls", error);
    //   }
    // };

    if (activeCharacterId) {
      fetchCharacter();
      // fetchDiceRolls();
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
      {/* <ul>
        {diceRolls.map((roll: any) => (
          <li key={roll.id}>
            {roll.rollValue} ({roll.diceType}) -{" "}
            {roll.success ? "Success" : "Fail"}
          </li>
        ))}
      </ul> */}
    </div>
  );
};
