import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Button,
  Container,
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import api from "../Utils/api";
import CharacterData from "../Interfaces/CharacterData";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionRollTrends from "../Components/StatsSectionRollTrends";
import StatsSectionRollDistribution from "../Components/StatsSectionRollDistribution";
import StatsSectionRollTypes from "../Components/StatsSectionRollTypes";
import StatsSectionOverview from "../Components/StatsSectionOverview";

type TabValue =
  | "overview"
  | "dice-types"
  | "d20-rolls"
  | "trends"
  | "success-rates"
  | "roll distribution"
  | "roll types";

export default function StatsPage() {
  const [currentTab, setCurrentTab] = useState<TabValue>("overview");
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [diceRollData, setDiceRollData] = useState<DiceRollData[]>([]);
  const [activeDiceRollData, setActiveDiceRollData] = useState<DiceRollData[]>(
    []
  );

  useEffect(() => {
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });

    api.get("/diceroll").then((response) => {
      setDiceRollData(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      const filteredData = diceRollData.filter(
        (roll) => roll.characterId === selectedCharacter.characterId
      );
      setActiveDiceRollData(filteredData);
    } else {
      setActiveDiceRollData(diceRollData);
    }
  }, [selectedCharacter, diceRollData]);

  const handleTabChange = (event: SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  };

  const handleCharacterChange = (event: SelectChangeEvent<string>) => {
    const selectedCharacterId = parseInt(event.target.value);
    const selectedCharacter =
      characters.find(
        (character) => character.characterId === selectedCharacterId
      ) || null;
    setSelectedCharacter(selectedCharacter);
  };

  return (
    <Container>
      <Typography variant="h5">Statistics</Typography>

      <Box>
        <Select
          value={
            selectedCharacter?.characterId
              ? String(selectedCharacter.characterId)
              : ""
          }
          onChange={handleCharacterChange}
          displayEmpty
          renderValue={(value) => {
            if (value === "") {
              return <em>Select a Character</em>;
            }
            const selectedCharacter = characters.find(
              (character) => String(character.characterId) === value
            );
            return selectedCharacter ? selectedCharacter.name : "";
          }}
        >
          <MenuItem value="">
            <em>All Characters</em>
          </MenuItem>
          {characters.map((character) => (
            <MenuItem
              key={character.characterId}
              value={String(character.characterId)}
            >
              {character.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box>
        <Box>
          <Button onClick={(e) => handleTabChange(e, "overview")}>
            Overview
          </Button>

          <Button onClick={(e) => handleTabChange(e, "trends")}>
            Roll Trends
          </Button>

          <Button onClick={(e) => handleTabChange(e, "roll distribution")}>
            Roll Distribution
          </Button>

          <Button onClick={(e) => handleTabChange(e, "roll types")}>
            Roll Types
          </Button>
        </Box>

        <Box>
          {currentTab === "overview" && (
            <StatsSectionOverview diceRolls={activeDiceRollData} />
          )}

          {currentTab === "trends" && (
            <StatsSectionRollTrends diceRolls={activeDiceRollData} />
          )}

          {currentTab === "roll distribution" && (
            <StatsSectionRollDistribution diceRolls={activeDiceRollData} />
          )}

          {currentTab === "roll types" && (
            <StatsSectionRollTypes diceRolls={activeDiceRollData} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
