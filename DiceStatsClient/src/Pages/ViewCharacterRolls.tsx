import React from "react";
import { useParams } from "react-router-dom";

export default function ViewCharacterRolls() {
  const { id } = useParams();

  return (
    <div>
      <h1>View Rolls for Character {id}</h1>

    </div>
  );
}
