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
  const [rollTrendsByDiceSize, setRollTrendsByDiceSize] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [rollTrendsByRollType, setRollTrendsByRollType] = useState<{
    [key: string]: { [index: number]: number};
  }>({});
  const [standardDeviationByDiceSize, setStandardDeviationByDiceSize] =
    useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Fetch all characters for the user
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });

    api.get("/diceroll").then((response) => {
      console.log("DICEROLLS: ", response.data);
      setDiceRollData(response.data);
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

      const trendsByDiceSizeData = calculateRollTrendsByDiceSize(activeDiceRollData);
      setRollTrendsByDiceSize(trendsByDiceSizeData);

        const trendsByRollTypeData = calculateRollTrendsByRollType(activeDiceRollData);
        setRollTrendsByRollType(trendsByRollTypeData);
      const standardDeviationData =
        calculateStandardDeviationByDiceSize(activeDiceRollData);
      setStandardDeviationByDiceSize(standardDeviationData);
    } else {
      setAverageRollsByDiceSize({});
      setAverageRollByCategory({});
      setTotalRollsByDiceSize({});
      setRollDistributionByDiceSize({});
      setRollTrendsByDiceSize({});
      setStandardDeviationByDiceSize({});
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

  const calculateRollTrendsByDiceSize = (diceRolls: DiceRollData[]) => {
    const trends: { [key: number]: { [index: number]: number } } = {};

    // Group rolls by dice size
    const rollsByDiceSize = diceRolls.reduce<{ [key: number]: number[] }>(
      (acc, roll) => {
        if (!acc[roll.diceSize]) {
          acc[roll.diceSize] = [];
        }
        acc[roll.diceSize].push(roll.rollValue);
        return acc;
      },
      {}
    );

    // Calculate rolling average by roll number
    Object.keys(rollsByDiceSize).forEach((size) => {
      const rolls = rollsByDiceSize[parseInt(size)]; // Convert size to number
      const rollTrends: { [index: number]: number } = {};

      rolls.forEach((rollValue, index) => {
        const sum = rolls
          .slice(0, index + 1)
          .reduce<number>((a, b) => a + b, 0);
        const average = sum / (index + 1);
        rollTrends[index + 1] = average;
      });

      trends[parseInt(size)] = rollTrends; // Convert size to number
    });

    return trends;
  };

  const formatRollTrendsByDiceSizeForDisplay = (trends: {
    [key: string]: { [index: number]: number };
  }) => {
    return Object.entries(trends).map(([size, trendData]) => (
      <Box key={size}>
        <Typography variant="subtitle1">Dice Size {size}:</Typography>
        <ul>
          {Object.entries(trendData).map(([rollNumber, average]) => (
            <li key={rollNumber}>
              Roll {rollNumber}: Average Value {average.toFixed(2)}
            </li>
          ))}
        </ul>
      </Box>
    ));
  };

  const calculateStandardDeviationByDiceSize = (diceRolls: DiceRollData[]) => {
    const diceSizes = Array.from(
      new Set(diceRolls.map((roll) => roll.diceSize))
    );
    const standardDeviationByDiceSize: { [key: string]: number } = {};

    diceSizes.forEach((size) => {
      const rollsOfSize = diceRolls.filter((roll) => roll.diceSize === size);
      const average =
        rollsOfSize.reduce((sum, roll) => sum + roll.rollValue, 0) /
        rollsOfSize.length;

      const variance =
        rollsOfSize.reduce(
          (sum, roll) => sum + Math.pow(roll.rollValue - average, 2),
          0
        ) / rollsOfSize.length;

      const standardDeviation = Math.sqrt(variance);
      standardDeviationByDiceSize[size] = standardDeviation;
    });

    return standardDeviationByDiceSize;
  };

  const calculateRollTrendsByRollType = (diceRolls: DiceRollData[]) => {
    const trends: { [key: string]: { [index: number]: number } } = {};

    const rollsByRollType = diceRolls.reduce<{ [key: string]: number[] }>(
      (acc, roll) => {
        if (roll.rollType) {
          if (!acc[roll.rollType]) {
            acc[roll.rollType] = [];
          }
          acc[roll.rollType].push(roll.rollValue);
        }
        return acc;
      },
      {}
    );

    Object.keys(rollsByRollType).forEach((type) => {
      const rolls = rollsByRollType[type];
      const rollTrends: { [index: number]: number } = {};

      rolls.forEach((rollValue, index) => {
        const sum = rolls
          .slice(0, index + 1)
          .reduce<number>((a, b) => a + b, 0);
        const average = sum / (index + 1);
        rollTrends[index + 1] = average;
      });

      trends[type] = rollTrends;
    });

    return trends;
  };

  const formatRollTrendsByRollTypeForDisplay = (trends: {
    [key: string]: { [index: number]: number };
  }) => {
    return Object.entries(trends).map(([type, trendData]) => (
      <Box key={type}>
        <Typography variant="subtitle1">{type}:</Typography>
        <ul>
          {Object.entries(trendData).map(([rollNumber, average]) => (
            <li key={rollNumber}>
              Roll {rollNumber}: Average Value {average.toFixed(2)}
            </li>
          ))}
        </ul>
      </Box>
    ));
  };

  return (
    <Container>
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
        <Typography variant="h5">Statistics</Typography>
        {/* Tab navigation */}
        <Box>
          <Button onClick={(e) => handleTabChange(e, "overview")}>
            Overview
          </Button>
          <Button onClick={(e) => handleTabChange(e, "dice-types")}>
            Dice Types
          </Button>
          <Button onClick={(e) => handleTabChange(e, "d20-rolls")}>
            d20 Rolls
          </Button>
          <Button onClick={(e) => handleTabChange(e, "trends")}>
            Roll Trends
          </Button>
          <Button onClick={(e) => handleTabChange(e, "success-rates")}>
            Success Rates
          </Button>
        </Box>
        <Box>
          {currentTab === "overview" && (
            <Grid container spacing={2}>
              {/* Overview Tab Content */}
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
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">
                    Standard Deviation by Dice Size
                  </Typography>
                  <ul>
                    {Object.entries(standardDeviationByDiceSize).map(
                      ([size, stdDev]) => (
                        <li key={size}>
                          Dice Size {size}: {stdDev.toFixed(2)}
                        </li>
                      )
                    )}
                  </ul>
                </Box>
              </Grid>
            </Grid>
          )}
          {currentTab === "trends" && (
            <>
              <Box>
                <Typography variant="h6">Roll Trends by Dice Size</Typography>
                {formatRollTrendsByDiceSizeForDisplay(rollTrendsByDiceSize)}
              </Box>

              <Box>
                <Typography variant="h6">Roll Trends by Roll Type</Typography>
                {formatRollTrendsByRollTypeForDisplay(rollTrendsByRollType)}
              </Box>
            </>
          )}
          {/* Add other tab content here */}
        </Box>
      </Box>
    </Container>
  );
}
