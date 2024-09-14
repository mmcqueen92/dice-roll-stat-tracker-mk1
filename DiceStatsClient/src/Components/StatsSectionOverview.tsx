import React, { useState, useEffect } from "react";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import { Grid2, Box, Typography, Container } from "@mui/material";

export default function StatsSectionOverview({ diceRolls }: StatsSectionProps) {
  const [averageRollsByDiceSize, setAverageRollsByDiceSize] = useState<{
    [key: string]: number;
  }>({});

  const [totalRollsByDiceSize, setTotalRollsByDiceSize] = useState<{
    [key: string]: number;
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

  useEffect(() => {
    if (diceRolls.length > 0) {
      const calculatedData = calculateAverageRollsByDiceSize(diceRolls);
      setAverageRollsByDiceSize(calculatedData);

      const totalRollsData = calculateTotalRollsByDiceSize(diceRolls);
      setTotalRollsByDiceSize(totalRollsData);

      const standardDeviationData =
        calculateStandardDeviationByDiceSize(diceRolls);
      setStandardDeviationByDiceSize(standardDeviationData);

      const streakData = calculateRollingStreaks(diceRolls);
      setStreakRecords(streakData);

      const critAndFumbleRates = calculateCritAndFumbleRates(diceRolls);
      setCritAndFumbleRates(critAndFumbleRates);
    } else {
      setAverageRollsByDiceSize({});
      setTotalRollsByDiceSize({});
      setStandardDeviationByDiceSize({});
      setStreakRecords({ successStreak: 0, failStreak: 0 });
      setCritAndFumbleRates({ critRate: 0, fumbleRate: 0 });
    }
  }, [diceRolls]);

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

  return (
    <Grid2 container spacing={2}>
      <Box>
        <Typography variant="h6">Average Rolls by Dice Size</Typography>
        <ul>
          {Object.entries(averageRollsByDiceSize).map(([size, average]) => (
            <li key={size}>
              Dice Size {size}: {average.toFixed(2)}
            </li>
          ))}
        </ul>
      </Box>

      <Box>
        <Typography variant="h6">Total Rolls by Dice Size</Typography>
        <ul>
          {Object.entries(totalRollsByDiceSize).map(([size, total]) => (
            <li key={size}>
              Dice Size {size}: {total}
            </li>
          ))}
        </ul>
      </Box>

      <Box>
        <Typography variant="h6">Standard Deviation by Dice Size</Typography>
        <ul>
          {Object.entries(standardDeviationByDiceSize).map(([size, stdDev]) => (
            <li key={size}>
              Dice Size {size}: {stdDev.toFixed(2)}
            </li>
          ))}
        </ul>
      </Box>

      <Box>
        <Typography variant="h6">Rolling Streak Records</Typography>
        <p>Longest Success Streak: {streakRecords.successStreak}</p>
        <p>Longest Fail Streak: {streakRecords.failStreak}</p>
      </Box>

      <Box>
        <Typography variant="h6">Crit/Fumble Rates</Typography>
        <p>Crit rate: {(critAndFumbleRates.critRate * 100).toFixed(2)}%</p>
        <p>Fumble rate: {(critAndFumbleRates.fumbleRate * 100).toFixed(2)}%</p>
      </Box>
    </Grid2>
  );
}
