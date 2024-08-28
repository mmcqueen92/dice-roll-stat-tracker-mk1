import React, { useState, useEffect } from "react";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import { Grid, Box, Typography } from "@mui/material";
import RollDistributionChart from "./RollDistributionChart";
import DiceRollData from "../Interfaces/DiceRollData";
export default function StatsSectionRollDistribution({
  diceRolls,
}: StatsSectionProps) {
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

  useEffect(() => {
    const distributionData = calculateRollDistributionByDiceSize(diceRolls);
    setRollDistributionByDiceSize(distributionData);
  });

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
  );
}
