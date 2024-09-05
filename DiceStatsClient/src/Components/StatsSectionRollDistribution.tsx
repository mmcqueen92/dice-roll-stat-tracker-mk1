import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import RollDistributionChart from "./RollDistributionChart";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import DiceRollData from "../Interfaces/DiceRollData";

export default function StatsSectionRollDistribution({
  diceRolls,
}: StatsSectionProps) {
  const [selectedDiceSize, setSelectedDiceSize] = useState("20");
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

  const handleDiceSizeChange = (event: SelectChangeEvent) => {
    setSelectedDiceSize(event.target.value);
  };

  useEffect(() => {
    const distributionData = calculateRollDistributionByDiceSize(diceRolls);
    setRollDistributionByDiceSize(distributionData);
  }, [diceRolls]);

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

    diceRolls.forEach((roll) => {
      const size = roll.diceSize;
      const rollValue = roll.rollValue;

      if (distribution[size] && distribution[size][rollValue] !== undefined) {
        distribution[size][rollValue] += 1;
      }
    });

    return distribution;
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h6">Roll Distribution by Dice Size</Typography>

          <FormControl style={{ width: "150px" }}>
            <InputLabel id="dice-size-select-label">Dice Size</InputLabel>
            <Select
              labelId="dice-size-select-label"
              value={selectedDiceSize}
              onChange={handleDiceSizeChange}
              label="Dice Size"
            >
              <MenuItem value="20">D-20</MenuItem>
              <MenuItem value="12">D-12</MenuItem>
              <MenuItem value="10">D-10</MenuItem>
              <MenuItem value="8">D-8</MenuItem>
              <MenuItem value="6">D-6</MenuItem>
              <MenuItem value="4">D-4</MenuItem>
            </Select>
          </FormControl>

          {rollDistributionByDiceSize && (
            <RollDistributionChart
              data={rollDistributionByDiceSize[selectedDiceSize]}
              title={`D${selectedDiceSize} Roll Distribution`}
            />
          )}
        </Box>
      </Grid>
    </>
  );
}
