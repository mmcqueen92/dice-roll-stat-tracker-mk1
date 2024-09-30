import React, { useState, useEffect } from "react";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import { Box, Card, Typography } from "@mui/material";
import IDiceRollsVsAverage from "../Interfaces/IDiceRollsVsAverage";
import { ReactComponent as D4Icon } from "../Assets/d4icon.svg";
import { ReactComponent as D6Icon } from "../Assets/d6icon.svg";
import { ReactComponent as D8Icon } from "../Assets/d8icon.svg";
import { ReactComponent as D10Icon } from "../Assets/d10icon.svg";
import { ReactComponent as D12Icon } from "../Assets/d12icon.svg";
import { ReactComponent as D20Icon } from "../Assets/d20icon.svg";
import {ReactComponent as ArrowIcon} from "../Assets/arrowicon.svg"
import StatDisplay from "./StatDisplay";
const diceIcons = {
  "4": D4Icon,
  "6": D6Icon,
  "8": D8Icon,
  "10": D10Icon,
  "12": D12Icon,
  "20": D20Icon,
};

export default function StatsSectionOverview({ diceRolls }: StatsSectionProps) {
  const [averageRollsByDiceSize, setAverageRollsByDiceSize] = useState<{
    [key: string]: number;
  }>({});

  const [totalRollsByDiceSize, setTotalRollsByDiceSize] = useState<{
    [key: string]: number;
  }>({});

  const [diceRollsVsAverage, setDiceRollsVsAverage] =
    useState<IDiceRollsVsAverage>({
      20: { above: 0, below: 0 },
      12: { above: 0, below: 0 },
      10: { above: 0, below: 0 },
      8: { above: 0, below: 0 },
      6: { above: 0, below: 0 },
      4: { above: 0, below: 0 },
    });

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

      const streakData = calculateRollingStreaks(diceRolls);
      setStreakRecords(streakData);

      const critAndFumbleRates = calculateCritAndFumbleRates(diceRolls);
      setCritAndFumbleRates(critAndFumbleRates);

      setDiceRollsVsAverage(calculateDiceRollsVsAverage(diceRolls));
    } else {
      setAverageRollsByDiceSize({});
      setTotalRollsByDiceSize({});
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

  const calculateDiceRollsVsAverage = (
    diceRolls: DiceRollData[]
  ): IDiceRollsVsAverage => {
    const result: IDiceRollsVsAverage = {
      20: { above: 0, below: 0 },
      12: { above: 0, below: 0 },
      10: { above: 0, below: 0 },
      8: { above: 0, below: 0 },
      6: { above: 0, below: 0 },
      4: { above: 0, below: 0 },
    };

    diceRolls.forEach((roll) => {
      const { diceSize, rollValue } = roll;
      let average: number;

      switch (diceSize) {
        case 20:
          average = 10.5;
          if (rollValue > average) {
            result[20].above++;
          } else {
            result[20].below++;
          }
          break;

        case 12:
          average = 6.5;
          if (rollValue > average) {
            result[12].above++;
          } else {
            result[12].below++;
          }
          break;

        case 10:
          average = 5.5;
          if (rollValue > average) {
            result[10].above++;
          } else {
            result[10].below++;
          }
          break;

        case 8:
          average = 4.5;
          if (rollValue > average) {
            result[8].above++;
          } else {
            result[8].below++;
          }
          break;

        case 6:
          average = 3.5;
          if (rollValue > average) {
            result[6].above++;
          } else {
            result[6].below++;
          }
          break;

        case 4:
          average = 2.5;
          if (rollValue > average) {
            result[4].above++;
          } else {
            result[4].below++;
          }
          break;

        default:
          break;
      }
    });

    return result;
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

  const isDiceSize = (size: string): size is keyof typeof diceIcons => {
    return size in diceIcons;
  };

  return (
    <div className="overview-container">
      <div className="overview-stats-half">
        <StatDisplay>
          <Typography variant="h6">Average Rolls by Dice Size</Typography>
          <ul>
            {Object.entries(averageRollsByDiceSize).map(([size, average]) => {
              if (isDiceSize(size)) {
                const DiceIcon = diceIcons[size]; // No more TypeScript error here

                return (
                  <li key={size}>
                    <DiceIcon
                      width="30"
                      height="30"
                      style={{ marginRight: "10px" }}
                    />
                    <span>{average.toFixed(2)}</span>
                  </li>
                );
              }

              return (
                <li key={size}>
                  Dice Size {size}: {average.toFixed(2)}
                </li>
              );
            })}
          </ul>
        </StatDisplay>

        <StatDisplay>
          <Typography variant="h6">Total Rolls by Dice Size</Typography>
          <ul>
            {Object.entries(totalRollsByDiceSize).map(([size, total]) => {
              if (isDiceSize(size)) {
                const DiceIcon = diceIcons[size];

                return (
                  <li key={size}>
                    <DiceIcon
                      width="30"
                      height="30"
                      style={{ marginRight: "10px" }}
                    />
                    <span>{total}</span>
                  </li>
                );
              }

              return (
                <li key={size}>
                  Dice Size {size}: {total}
                </li>
              );
            })}
          </ul>
        </StatDisplay>

        <StatDisplay>
          <Typography variant="h6">Dice Rolls Above/Below Average</Typography>
          <ul>
            {Object.entries(diceRollsVsAverage).map(([size, count]) => {
              if (isDiceSize(size)) {
                const DiceIcon = diceIcons[size];

                return (
                  <li key={size}>
                    <DiceIcon
                      width="30"
                      height="30"
                      style={{ marginRight: "10px" }}
                    />
                    <span style={{ color: "green", marginRight: "10px" }}>
                      <ArrowIcon width="30" height="30" />
                      {count.above}
                    </span>
                    <span style={{ color: "red" }}>
                      <ArrowIcon
                        width="30"
                        height="30"
                        style={{ transform: "rotate(180deg)" }}
                      />
                      {count.below}
                    </span>
                  </li>
                );
              }

              return (
                <li key={size}>
                  Dice Size {size}: <span>+: {count.above}</span>
                  <span> -: {count.below}</span>
                </li>
              );
            })}
          </ul>
        </StatDisplay>
      </div>

      <div className="overview-stats-half">
        <Card className="overview-stat" sx={{ backgroundColor: "#e0e0e0" }}>
          <Typography variant="h6">Rolling Streak Records</Typography>
          <p>Longest Success Streak: {streakRecords.successStreak}</p>
          <p>Longest Fail Streak: {streakRecords.failStreak}</p>
        </Card>

        <Card className="overview-stat" sx={{ backgroundColor: "#e0e0e0" }}>
          <Typography variant="h6">Crit/Fumble Rates</Typography>
          <p>Crit rate: {(critAndFumbleRates.critRate * 100).toFixed(2)}%</p>
          <p>
            Fumble rate: {(critAndFumbleRates.fumbleRate * 100).toFixed(2)}%
          </p>
        </Card>
      </div>
    </div>
  );
}
