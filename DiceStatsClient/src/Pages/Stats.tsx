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
import api from "../Utils/api";
import CharacterData from "../Interfaces/CharacterData";
import DiceRollData from "../Interfaces/DiceRollData";
import RollTrendsLineChart from "../Components/RollTrendsLineChart";
import RollTypeRatesPieChart from "../Components/RollTypeRatesPieChart";
import RollDistributionChart from "../Components/RollDistributionChart";
import RollTrendsStatsSection from "../Components/RollTrendsStatsSection";

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
  }>({
    4: { 1: 0, 2: 0, 3: 0, 4: 0 },
    6: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    8: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
    10: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    12: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    },
    20: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
    },
  });
  const [rollTrendsByDiceSize, setRollTrendsByDiceSize] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [rollTrendsByRollType, setRollTrendsByRollType] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [standardDeviationByDiceSize, setStandardDeviationByDiceSize] =
    useState<{ [key: string]: number }>({});

  const [streakRecords, setStreakRecords] = useState<{
    successStreak: number;
    failStreak: number;
  }>({ successStreak: 0, failStreak: 0 });

  const [critAndFumbleRates, setCritAndFumbleRates] = useState<{
    critRate: number;
    fumbleRate: number;
  }>({ critRate: 0, fumbleRate: 0 });

  const [rollsBySkillType, setRollsBySkillType] = useState<{
    [key: string]: number;
  }>({});

  const [successRateBySkillType, setSuccessRateBySkillType] = useState<{
    [key: string]: number;
  }>({});

  const [attackSuccessRate, setAttackSuccessRate] = useState<{
    success: number;
    total: number;
  }>({ success: 0, total: 0 });

  const [rollsByRollType, setRollsByRollType] = useState<{
    Attack: number;
    "Ability/Skill Check": number;
    "Saving Throw": number;
    "Attack/Spell Damage": number;
  }>({
    Attack: 0,
    "Ability/Skill Check": 0,
    "Saving Throw": 0,
    "Attack/Spell Damage": 0,
  });

  const [rollTypeRates, setRollTypeRates] = useState<{
    attack: number;
    abilityOrSkillCheck: number;
    savingThrow: number;
    attackOrSpellDamage: number;
  }>({
    attack: 0,
    abilityOrSkillCheck: 0,
    savingThrow: 0,
    attackOrSpellDamage: 0,
  });

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

      const trendsByDiceSizeData =
        calculateRollTrendsByDiceSize(activeDiceRollData);
      setRollTrendsByDiceSize(trendsByDiceSizeData);

      const trendsByRollTypeData =
        calculateRollTrendsByRollType(activeDiceRollData);
      setRollTrendsByRollType(trendsByRollTypeData);

      const standardDeviationData =
        calculateStandardDeviationByDiceSize(activeDiceRollData);
      setStandardDeviationByDiceSize(standardDeviationData);

      const streakData = calculateRollingStreaks(activeDiceRollData);
      setStreakRecords(streakData);

      const critAndFumbleRates =
        calculateCritAndFumbleRates(activeDiceRollData);
      setCritAndFumbleRates(critAndFumbleRates);

      const rollsBySkillType = calculateRollsBySkillType(activeDiceRollData);
      setRollsBySkillType(rollsBySkillType);

      const successRatesBySkillType =
        calculateSuccessRateBySkillType(activeDiceRollData);
      setSuccessRateBySkillType(successRatesBySkillType);

      setAttackSuccessRate(calculateAttackSuccessRate(activeDiceRollData));
      setRollsByRollType(calculateRollsByRollType(activeDiceRollData));
      setRollTypeRates(calculateRollTypeRates(activeDiceRollData));
    } else {
      setAverageRollsByDiceSize({});
      setAverageRollByCategory({});
      setTotalRollsByDiceSize({});
      setRollDistributionByDiceSize({});
      setRollTrendsByDiceSize({});
      setRollTrendsByRollType({});
      setStandardDeviationByDiceSize({});
      setStreakRecords({ successStreak: 0, failStreak: 0 });
      setCritAndFumbleRates({ critRate: 0, fumbleRate: 0 });
      setRollsBySkillType({});
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
    const distribution: { [key: string]: { [rollValue: number]: number } } = {
      4: { 1: 0, 2: 0, 3: 0, 4: 0 },
      6: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      8: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
      10: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      12: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      20: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0,
      },
    };

    // Process the dice rolls to populate the distribution object
    diceRolls.forEach((roll) => {
      const size = roll.diceSize;
      const rollValue = roll.rollValue;

      if (distribution[size] && distribution[size][rollValue] !== undefined) {
        distribution[size][rollValue] += 1;
      }
    });

    return distribution;
  };

  const calculateRollTrendsByDiceSize = (diceRolls: DiceRollData[]) => {
    const trends: { [key: number]: { [index: number]: number } } = {};

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

    Object.keys(rollsByDiceSize).forEach((size) => {
      const rolls = rollsByDiceSize[parseInt(size)];
      const rollTrends: { [index: number]: number } = {};

      rolls.forEach((rollValue, index) => {
        const sum = rolls
          .slice(0, index + 1)
          .reduce<number>((a, b) => a + b, 0);
        const average = sum / (index + 1);
        rollTrends[index + 1] = average;
      });

      trends[parseInt(size)] = rollTrends;
    });

    return trends;
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

  const calculateRollingStreaks = (diceRolls: DiceRollData[]) => {
    const streaks: { successStreak: number; failStreak: number } = {
      successStreak: 0,
      failStreak: 0,
    };

    let currentSuccessStreak = 0;
    let currentFailStreak = 0;

    diceRolls.forEach((roll) => {
      if (roll.success !== null) {
        if (roll.success === true) {
          currentFailStreak = 0;
          currentSuccessStreak++;
          if (currentSuccessStreak > streaks.successStreak) {
            streaks.successStreak = currentSuccessStreak;
          }
        } else {
          currentSuccessStreak = 0;
          currentFailStreak++;
          if (currentFailStreak > streaks.failStreak) {
            streaks.failStreak = currentFailStreak;
          }
        }
      }
    });

    return streaks;
  };

  const calculateCritAndFumbleRates = (diceRolls: DiceRollData[]) => {
    const rates: { critRate: number; fumbleRate: number } = {
      critRate: 0,
      fumbleRate: 0,
    };

    const rollsWithoutDamage = diceRolls.filter(
      (roll) => roll.rollType !== "Attack/Spell Damage"
    );

    const crits = rollsWithoutDamage.filter((roll) => roll.rollValue === 20);
    const fumbles = rollsWithoutDamage.filter((roll) => roll.rollValue === 1);

    rates.critRate = crits.length / rollsWithoutDamage.length;
    rates.fumbleRate = fumbles.length / rollsWithoutDamage.length;

    return rates;
  };

  const calculateRollsBySkillType = (diceRolls: DiceRollData[]) => {
    const filteredRolls = diceRolls.filter(
      (roll) =>
        roll.rollType === "Skill Check" || roll.rollType === "Saving Throw"
    );

    const counts: { [key: string]: number } = {};

    filteredRolls.forEach((roll) => {
      if (roll.skillType) {
        const skillType = roll.skillType;

        if (counts[skillType]) {
          counts[skillType]++;
        } else {
          counts[skillType] = 1;
        }
      }
    });

    return counts;
  };

  const calculateSuccessRateBySkillType = (diceRolls: DiceRollData[]) => {
    const filteredRolls = diceRolls.filter(
      (roll) =>
        roll.rollType === "Skill Check" || roll.rollType === "Saving Throw"
    );

    const successRates: { [key: string]: number } = {};

    const successCounts: { [key: string]: { [key: string]: number } } = {};

    filteredRolls.forEach((roll) => {
      if (roll.skillType && roll.success !== null) {
        const skillType = roll.skillType;
        if (successCounts[skillType]) {
          successCounts[skillType].total++;
          if (roll.success) {
            successCounts[skillType].success++;
          }
        } else {
          successCounts[skillType] = { total: 1, success: 0 };
          if (roll.success) {
            successCounts[skillType].success++;
          }
        }
      }
    });

    Object.keys(successCounts).forEach((skillType) => {
      successRates[skillType] =
        successCounts[skillType].success / successCounts[skillType].total;
    });

    return successRates;
  };

  const calculateAttackSuccessRate = (diceRolls: DiceRollData[]) => {
    const filteredRolls = diceRolls.filter(
      (roll) => roll.rollType === "Attack"
    );

    const data = {
      success: 0,
      total: 0,
    };

    filteredRolls.forEach((roll) => {
      if (roll.success) {
        data.success++;
        data.total++;
      } else {
        data.total++;
      }
    });

    return data;
  };

  const calculateRollsByRollType = (diceRolls: DiceRollData[]) => {
    const d20Rolls = diceRolls.filter((roll) => roll.diceSize === 20);

    const rollTypeCounts: {
      Attack: number;
      "Ability/Skill Check": number;
      "Saving Throw": number;
      "Attack/Spell Damage": number;
    } = {
      Attack: 0,
      "Ability/Skill Check": 0,
      "Saving Throw": 0,
      "Attack/Spell Damage": 0,
    };

    d20Rolls.forEach((roll) => {
      switch (roll.rollType) {
        case "Attack":
          rollTypeCounts[roll.rollType]++;
          break;
        case "Ability/Skill Check":
          rollTypeCounts[roll.rollType]++;
          break;
        case "Saving Throw":
          rollTypeCounts[roll.rollType]++;
          break;
        case "Attack/Spell Damage":
          rollTypeCounts[roll.rollType]++;
          break;
        default:
          break;
      }
    });

    return rollTypeCounts;
  };

  const calculateRollTypeRates = (diceRolls: DiceRollData[]) => {
    const d20Rolls = diceRolls.filter((roll) => roll.diceSize === 20);

    const rollTypeCounts: {
      attack: number;
      skillCheck: number;
      savingThrow: number;
      attackOrSpellDamage: number;
      total: number;
    } = {
      attack: 0,
      skillCheck: 0,
      savingThrow: 0,
      attackOrSpellDamage: 0,
      total: 0,
    };

    d20Rolls.forEach((roll) => {
      switch (roll.rollType) {
        case "Attack":
          rollTypeCounts.attack++;
          rollTypeCounts.total++;
          break;
        case "Ability/Skill Check":
          rollTypeCounts.skillCheck++;
          rollTypeCounts.total++;
          break;
        case "Saving Throw":
          rollTypeCounts.savingThrow++;
          rollTypeCounts.total++;
          break;
        case "Attack/Spell Damage":
          rollTypeCounts.attackOrSpellDamage++;
          rollTypeCounts.total++;
          break;

        default:
          break;
      }
    });

    const rollTypeRates = {
      attack: rollTypeCounts.attack / rollTypeCounts.total,
      abilityOrSkillCheck: rollTypeCounts.skillCheck / rollTypeCounts.total,
      savingThrow: rollTypeCounts.savingThrow / rollTypeCounts.total,
      attackOrSpellDamage:
        rollTypeCounts.attackOrSpellDamage / rollTypeCounts.total,
    };

    return rollTypeRates;
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

      <Box></Box>

      <Box>
        {/* Tab navigation */}
        <Box>
          <Button onClick={(e) => handleTabChange(e, "overview")}>
            Overview
          </Button>
          {/* <Button onClick={(e) => handleTabChange(e, "dice-types")}>
            Dice Types
          </Button> */}
          {/* <Button onClick={(e) => handleTabChange(e, "d20-rolls")}>
            d20 Rolls
          </Button> */}
          <Button onClick={(e) => handleTabChange(e, "trends")}>
            Roll Trends
          </Button>
          {/* <Button onClick={(e) => handleTabChange(e, "success-rates")}>
            Success Rates
          </Button> */}
          <Button onClick={(e) => handleTabChange(e, "roll distribution")}>
            Roll Distribution
          </Button>
          <Button onClick={(e) => handleTabChange(e, "roll types")}>
            Roll Types
          </Button>
        </Box>
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

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">Rolling Streak Records</Typography>
                  <p>Longest Success Streak: {streakRecords.successStreak}</p>
                  <p>Longest Fail Streak: {streakRecords.failStreak}</p>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">Crit/Fumble Rates</Typography>
                  <p>
                    Crit rate: {(critAndFumbleRates.critRate * 100).toFixed(2)}%
                  </p>
                  <p>
                    Fumble rate:{" "}
                    {(critAndFumbleRates.fumbleRate * 100).toFixed(2)}%
                  </p>
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "trends" && (
            <>
              <RollTrendsStatsSection
                diceRolls={activeDiceRollData}
              ></RollTrendsStatsSection>
            </>
          )}

          {currentTab === "roll distribution" && (
            <>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">
                    Roll Distribution by Dice Size
                  </Typography>

                  {rollDistributionByDiceSize && (
                    <>
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[20]}
                        title="D20 Roll Distribution"
                      />
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[12]}
                        title="D12 Roll Distribution"
                      />
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[10]}
                        title="D10 Roll Distribution"
                      />
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[8]}
                        title="D8 Roll Distribution"
                      />
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[6]}
                        title="D6 Roll Distribution"
                      />
                      <RollDistributionChart
                        data={rollDistributionByDiceSize[4]}
                        title="D4 Roll Distribution"
                      />
                    </>
                  )}
                </Box>
              </Grid>
            </>
          )}

          {currentTab === "roll types" && (
            <>
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

                  <Typography variant="h6">
                    Total Rolls by Category (d20)
                  </Typography>
                  <ul>
                    {Object.entries(rollsByRollType).map(([type, total]) => (
                      <li key={type}>
                        {type}: {total}
                      </li>
                    ))}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="h6">D20 Roll Type Rates</Typography>

                  <RollTypeRatesPieChart
                    data={rollTypeRates}
                    title="Roll Type Distribution"
                  />
                </Box>

                <Box>
                  <Typography variant="h6">Rolls by Skill Types</Typography>

                  <ul>
                    {Object.entries(rollsBySkillType).map(
                      ([skillType, count], index) => (
                        <li key={index}>
                          {skillType}: {count}
                        </li>
                      )
                    )}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="h6">
                    Success Rates by Skill Types
                  </Typography>

                  <ul>
                    <li>
                      Attack:{" "}
                      {(
                        (attackSuccessRate.success / attackSuccessRate.total) *
                        100
                      ).toFixed(2)}
                      %
                    </li>
                    {Object.entries(successRateBySkillType).map(
                      ([skillType, successRate], index) => (
                        <li key={index}>
                          {skillType}: {(successRate * 100).toFixed(2)}%
                        </li>
                      )
                    )}
                  </ul>
                </Box>
              </Grid>
            </>
          )}
          {/* Add other tab content here */}
        </Box>
      </Box>
    </Container>
  );
}
