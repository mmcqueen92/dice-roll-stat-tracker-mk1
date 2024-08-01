import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Button,
  Container,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import api from "../Utils/api"; // Adjust the import path as needed
import CharacterData from "../Interfaces/CharacterData"; // Adjust the import path as needed
import DiceRollData from "../Interfaces/DiceRollData";

type TabValue =
  | "overview"
  | "dice-types"
  | "d20-rolls"
  | "trends"
  | "success-rates";

export default function StatsPage() {
  const [currentTab, setCurrentTab] = useState<TabValue>("overview");
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [diceRollData, setDiceRollData] = useState<DiceRollData[]>([]);
  const [activeDiceRollData, setActiveDiceRollData] = useState<DiceRollData[]>(
    []
  );
  const [averageRollsByDiceSize, setAverageRollsByDiceSize] = useState<{
    [key: string]: number;
  }>({});
  const [averageRollByCategory, setAverageRollByCategory] = useState<{
    [key: string]: number;
  }>({});
  const [totalRollsByDiceSize, setTotalRollsByDiceSize] = useState<{
    [key: string]: number;
  }>({});
  const [rollDistributionByDiceSize, setRollDistributionByDiceSize] = useState<{
    [key: string]: { [rollValue: number]: number };
  }>({});

  useEffect(() => {
    // Fetch all characters for the user
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });

    api.get("/diceroll").then((response) => {
      console.log("DICEROLLS: ", response.data);
      setDiceRollData(response.data);
      // Process and set data for charts
      // Example: setAverageRollsData(response.data.averageRolls);
    });
  }, []);

  useEffect(() => {
    if (diceRollData.length > 0) {
      const calculatedData = calculateAverageRollsByDiceSize(diceRollData);
      setAverageRollsByDiceSize(calculatedData);
    }
  }, [diceRollData]);

  useEffect(() => {
    if (selectedCharacter) {
      // Filter diceRollData for the selected character
      const filteredData = diceRollData.filter(
        (roll) => roll.characterId === selectedCharacter.characterId
      );
      setActiveDiceRollData(filteredData);
    } else {
      // If no character is selected, show all dice rolls
      setActiveDiceRollData(diceRollData);
    }
  }, [selectedCharacter, diceRollData]);

  useEffect(() => {
    if (activeDiceRollData.length > 0) {
      const calculatedData =
        calculateAverageRollsByDiceSize(activeDiceRollData);
      setAverageRollsByDiceSize(calculatedData);

      const averageByCategory =
        calculateAverageRollByCategory(activeDiceRollData);
      setAverageRollByCategory(averageByCategory);

      const totalRollsData = calculateTotalRollsByDiceSize(activeDiceRollData);
      setTotalRollsByDiceSize(totalRollsData);

      const distributionData =
        calculateRollDistributionByDiceSize(activeDiceRollData);
      setRollDistributionByDiceSize(distributionData);
    } else {
      setAverageRollsByDiceSize({});
      setAverageRollByCategory({});
      setTotalRollsByDiceSize({});
      setRollDistributionByDiceSize({});
    }
  }, [activeDiceRollData]);

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

  const calculateAverageRollsByDiceSize = (diceRolls: DiceRollData[]) => {
    const diceSizes = Array.from(
      new Set(diceRolls.map((roll) => roll.diceSize))
    );
    const averageRollsByDiceSize: { [key: string]: number } = {};

    diceSizes.forEach((size) => {
      const rollsOfSize = diceRolls.filter((roll) => roll.diceSize === size);
      const average =
        rollsOfSize.reduce((sum, roll) => sum + roll.rollValue, 0) /
        rollsOfSize.length;
      averageRollsByDiceSize[size] = average;
    });

    return averageRollsByDiceSize;
  };

  const calculateAverageRollByCategory = (diceRolls: DiceRollData[]) => {
    const categories = ["Attack", "Skill Check", "Saving Throw"];
    const categorySums: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};

    diceRolls.forEach((roll) => {
      if (
        roll.diceSize === 20 &&
        roll.rollType &&
        categories.includes(roll.rollType)
      ) {
        if (!categorySums[roll.rollType]) {
          categorySums[roll.rollType] = 0;
          categoryCounts[roll.rollType] = 0;
        }
        categorySums[roll.rollType] += roll.rollValue;
        categoryCounts[roll.rollType] += 1;
      }
    });

    const averages: { [key: string]: number } = {};
    categories.forEach((category) => {
      if (categoryCounts[category]) {
        averages[category] = categorySums[category] / categoryCounts[category];
      } else {
        averages[category] = 0;
      }
    });

    return averages;
  };

  const calculateTotalRollsByDiceSize = (diceRolls: DiceRollData[]) => {
    const totalRollsByDiceSize: { [key: string]: number } = {};

    diceRolls.forEach((roll) => {
      const size = roll.diceSize;
      if (!totalRollsByDiceSize[size]) {
        totalRollsByDiceSize[size] = 0;
      }
      totalRollsByDiceSize[size] += 1;
    });

    return totalRollsByDiceSize;
  };

  const calculateRollDistributionByDiceSize = (diceRolls: DiceRollData[]) => {
    const distribution: { [key: string]: { [rollValue: number]: number } } = {};

    diceRolls.forEach((roll) => {
      const size = roll.diceSize;
      const rollValue = roll.rollValue;

      if (!distribution[size]) {
        distribution[size] = {};
      }

      if (!distribution[size][rollValue]) {
        distribution[size][rollValue] = 0;
      }

      distribution[size][rollValue] += 1;
    });

    return distribution;
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dice Roll Stats
        </Typography>

        {/* Character Selection Dropdown */}
        <Select
          value={
            selectedCharacter ? selectedCharacter.characterId.toString() : ""
          }
          onChange={handleCharacterChange}
          displayEmpty
          inputProps={{ "aria-label": "Select Character" }}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All Characters</MenuItem>
          {characters.map((character) => (
            <MenuItem key={character.characterId} value={character.characterId}>
              {character.name}
            </MenuItem>
          ))}
        </Select>

        {/* Date Range Picker */}
        {/* Implement your date range picker here */}

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/* Example Tab Navigation */}
          {/* <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Overview" value="overview" />
            <Tab label="Dice Types" value="dice-types" />
            <Tab label="d20 Rolls" value="d20-rolls" />
            <Tab label="Trends" value="trends" />
            <Tab label="Success Rates" value="success-rates" />
          </Tabs> */}
        </Box>

        {/* Tab Content */}
        <Box>
          {currentTab === "overview" && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">
                    Average Rolls by Dice Size
                  </Typography>
                  <ul>
                    {Object.entries(averageRollsByDiceSize).map(
                      ([size, average]) => (
                        <li key={size}>
                          Dice Size {size}: {average.toFixed(2)}
                        </li>
                      )
                    )}
                  </ul>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">Total Rolls by Dice Size</Typography>
                  <ul>
                    {Object.entries(totalRollsByDiceSize).map(
                      ([size, total]) => (
                        <li key={size}>
                          Dice Size {size}: {total}
                        </li>
                      )
                    )}
                  </ul>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">
                    Roll Distribution by Dice Size
                  </Typography>
                  {Object.entries(rollDistributionByDiceSize).map(
                    ([size, distribution]) => (
                      <Box key={size}>
                        <Typography variant="subtitle1">
                          Dice Size {size}:
                        </Typography>
                        <ul>
                          {Object.entries(distribution).map(
                            ([rollValue, count]) => (
                              <li key={rollValue}>
                                Roll Value {rollValue}: {count} times
                              </li>
                            )
                          )}
                        </ul>
                      </Box>
                    )
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">
                    Average Roll by Category (d20)
                  </Typography>
                  <ul>
                    {Object.entries(averageRollByCategory).map(
                      ([category, average]) => (
                        <li key={category}>
                          {category}: {average.toFixed(2)}
                        </li>
                      )
                    )}
                  </ul>
                </Box>
              </Grid>
            </Grid>
          )}
          {/* Add other tab content here */}
        </Box>
      </Box>
    </Container>
  );
}
