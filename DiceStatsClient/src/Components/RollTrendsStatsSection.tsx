import React, { useState, useEffect } from "react";
import RollTrendsLineChart from "./RollTrendsLineChart";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
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

export default function RollTrendsStatsSection({
  diceRolls,
}: StatsSectionProps) {
  const [rollTrendsByDiceSize, setRollTrendsByDiceSize] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [rollTrendsByRollType, setRollTrendsByRollType] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [activeDiceRollData, setActiveDiceRollData] =
    useState<DiceRollData[]>(diceRolls);

  useEffect(() => {
    if (diceRolls.length > 0) {
      const trendsByDiceSizeData =
        calculateRollTrendsByDiceSize(activeDiceRollData);
      setRollTrendsByDiceSize(trendsByDiceSizeData);

      const trendsByRollTypeData =
        calculateRollTrendsByRollType(activeDiceRollData);
      setRollTrendsByRollType(trendsByRollTypeData);
    }
  }, [activeDiceRollData]);

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
  return (
    <>
      <Box>
        <Typography variant="h6">Roll Trends by Dice Size</Typography>
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[20]}
          title="D-20 Roll Trends"
        />
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[12]}
          title="D-12 Roll Trends"
        />
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[10]}
          title="D-10 Roll Trends"
        />
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[8]}
          title="D-8 Roll Trends"
        />
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[6]}
          title="D-6 Roll Trends"
        />
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[4]}
          title="D-4 Roll Trends"
        />
      </Box>

      <Box>
        <Typography variant="h6">Roll Trends by Roll Type</Typography>
        <RollTrendsLineChart
          data={rollTrendsByRollType["Attack"]}
          title="Attacks"
        />
        <RollTrendsLineChart
          data={rollTrendsByRollType["Saving Throw"]}
          title="Saving Throws"
        />
        <RollTrendsLineChart
          data={rollTrendsByRollType["Skill Check"]}
          title="Skill Checks"
        />
        <RollTrendsLineChart
          data={rollTrendsByRollType["Attack/Spell Damage"]}
          title="Attack/Spell Damage Rolls"
        />
      </Box>
    </>
  );
}
