import React, { useState, useEffect } from "react";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import DiceRollData from "../Interfaces/DiceRollData";
import RollTypeRatesPieChart from "./RollTypeRatesPieChart";
import StatDisplay from "./StatDisplay";

import {
  Box,
  Grid2,
  Typography,
  Card,
} from "@mui/material";

export default function StatsSectionRollTypes({
  diceRolls,
}: StatsSectionProps) {
  const [averageRollByCategory, setAverageRollByCategory] = useState<{
    [key: string]: number;
  }>({});
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
  const [rollsBySkillType, setRollsBySkillType] = useState<{
    [key: string]: number;
  }>({});
  const [attackSuccessRate, setAttackSuccessRate] = useState<{
    success: number;
    total: number;
  }>({ success: 0, total: 0 });
  const [successRateBySkillType, setSuccessRateBySkillType] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    setAverageRollByCategory(calculateAverageRollByCategory(diceRolls));
    setRollsByRollType(calculateRollsByRollType(diceRolls));
    setRollTypeRates(calculateRollTypeRates(diceRolls));
    setRollsBySkillType(calculateRollsBySkillType(diceRolls));
    setAttackSuccessRate(calculateAttackSuccessRate(diceRolls));
    setSuccessRateBySkillType(calculateSuccessRateBySkillType(diceRolls));
  }, [diceRolls]);

  const calculateAverageRollByCategory = (diceRolls: DiceRollData[]) => {
    const categories = ["Attack", "Ability/Skill Check", "Saving Throw"];
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

  return (
    <Grid2
      container
      spacing={{ xs: 0, md: 5 }}
      direction={{ xs: "column", md: "row" }}
      className="roll-types-section-container"
    >
      <Box className="subsection-container">
        <Box className="subsection">
          <StatDisplay style={{ width: "100%" }}>
            <Typography variant="subtitle1">
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
          </StatDisplay>

          <StatDisplay>
            <Typography variant="subtitle1">
              Total Rolls by Category (d20)
            </Typography>
            <ul>
              {Object.entries(rollsByRollType).map(([type, total]) => (
                <li key={type}>
                  {type}: {total}
                </li>
              ))}
            </ul>
          </StatDisplay>
        </Box>

        <Box className="subsection">
          <StatDisplay>
            <Typography variant="subtitle1">
              Checks and Saves by Skill Types
            </Typography>

            <ul>
              {Object.entries(rollsBySkillType).map(
                ([skillType, count], index) => (
                  <li key={index}>
                    {skillType}: {count}
                  </li>
                )
              )}
            </ul>
          </StatDisplay>

          <StatDisplay>
            <Typography variant="subtitle1">
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
          </StatDisplay>
        </Box>
      </Box>

      <Box className="pie-chart-container">
        <Card sx={{ backgroundColor: "#e0e0e0", margin: "0 5px 5px 5px" }}>
          <Typography variant="subtitle1">D20 Roll Type Rates</Typography>

          <RollTypeRatesPieChart data={rollTypeRates} />
        </Card>
      </Box>
    </Grid2>
  );
}
