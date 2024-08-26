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
  Checkbox,
  FormControlLabel,
  FormGroup,
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
  const [selectedChart, setSelectedChart] = useState<number | null>(20); // Default to d20 chart
  const [selectedRollTypes, setSelectedRollTypes] = useState<string[]>([
    "Attack",
    "Saving Throw",
    "Ability/Skill Check",
    "Attack/Spell Damage",
  ]);
  const allRollTypes = [
    "Attack",
    "Saving Throw",
    "Ability/Skill Check",
    "Attack/Spell Damage",
  ];

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

  // Functions to calculate trends remain the same...
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
  // Handle chart selection
  const handleChartSelect = (event: SelectChangeEvent<number>) => {
    let diceSize = event.target.value;
    if (typeof diceSize === "string") {
      diceSize = parseInt(diceSize);
    }
    setSelectedChart(diceSize);
    if (diceSize !== 20) {
      setSelectedRollTypes(["All"]);
      setActiveDiceRollData(diceRolls);
    }
  };

  // Handle roll type filter changes
  const handleRollTypeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("EVENT.TARGET: ", event.target);
    const { name, checked } = event.target;
    let updatedRollTypes = [...selectedRollTypes];

    if (name === "All") {
      updatedRollTypes = checked ? allRollTypes : [];
    } else {
      if (checked) {
        updatedRollTypes.push(name);
      } else {
        updatedRollTypes = updatedRollTypes.filter((type) => type !== name);
      }
    }

    setSelectedRollTypes(updatedRollTypes);
  };

  // Filter data based on selected roll types
  useEffect(() => {
    if (selectedChart === 20 && selectedRollTypes.length > 0) {
      const filteredData = diceRolls.filter(
        (roll) =>
          selectedRollTypes.includes("All") ||
          selectedRollTypes.includes(roll.rollType!)
      );
      setActiveDiceRollData(filteredData);
    }
  }, [selectedRollTypes, selectedChart]);

  return (
    <Box>
      <Typography variant="h6">Select Chart</Typography>
      <Select value={selectedChart || ""} onChange={handleChartSelect}>
        <MenuItem value={20}>D-20 Roll Trends</MenuItem>
        <MenuItem value={12}>D-12 Roll Trends</MenuItem>
        <MenuItem value={10}>D-10 Roll Trends</MenuItem>
        <MenuItem value={8}>D-8 Roll Trends</MenuItem>
        <MenuItem value={6}>D-6 Roll Trends</MenuItem>
        <MenuItem value={4}>D-4 Roll Trends</MenuItem>
      </Select>

      {selectedChart === 20 && (
        <FormGroup>
          <Typography variant="subtitle1">Filter Roll Types</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={allRollTypes.every((type) => selectedRollTypes.includes(type))}
                onChange={handleRollTypeFilterChange}
                name="All"
              />
            }
            label="All"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRollTypes.includes("Attack")}
                onChange={handleRollTypeFilterChange}
                name="Attack"
              />
            }
            label="Attack"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRollTypes.includes("Saving Throw")}
                onChange={handleRollTypeFilterChange}
                name="Saving Throw"
              />
            }
            label="Saving Throw"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRollTypes.includes("Ability/Skill Check")}
                onChange={handleRollTypeFilterChange}
                name="Ability/Skill Check"
              />
            }
            label="Ability/Skill Check"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedRollTypes.includes("Attack/Spell Damage")}
                onChange={handleRollTypeFilterChange}
                name="Attack/Spell Damage"
              />
            }
            label="Attack/Spell Damage"
          />
        </FormGroup>
      )}

      {selectedChart && (
        <RollTrendsLineChart
          data={rollTrendsByDiceSize[selectedChart]}
          title={`D-${selectedChart} Roll Trends`}
          //   filters={selectedChart === 20}
        />
      )}
    </Box>
  );
}
