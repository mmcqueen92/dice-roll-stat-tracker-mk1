import React, { useState, useEffect } from "react";
import RollTrendsLineChart from "./RollTrendsLineChart";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionProps from "../Interfaces/StatsSectionProps";
import {
  FormControl,
  InputLabel,
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function StatsSectionRollTrends({
  diceRolls,
}: StatsSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rollTrendsByDiceSize, setRollTrendsByDiceSize] = useState<{
    [key: string]: { [index: number]: number };
  }>({});
  const [activeDiceRollData, setActiveDiceRollData] =
    useState<DiceRollData[]>(diceRolls);
  const [selectedChart, setSelectedChart] = useState<number | null>(20);
  const allRollTypes = [
    "Attack",
    "Saving Throw",
    "Ability/Skill Check",
    "Attack/Spell Damage",
  ];
  const [selectedRollTypes, setSelectedRollTypes] =
    useState<string[]>(allRollTypes);
  const [filterAccordionOpen, setFilterAccordionOpen] = useState(false);

  useEffect(() => {
    if (diceRolls.length > 0) {
      const trendsByDiceSizeData =
        calculateRollTrendsByDiceSize(activeDiceRollData);
      setRollTrendsByDiceSize(trendsByDiceSizeData);
    }
  }, [activeDiceRollData, diceRolls.length]);

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

  const handleChartSelect = (event: SelectChangeEvent<number>) => {
    let diceSize = event.target.value;
    if (typeof diceSize === "string") {
      diceSize = parseInt(diceSize);
    }
    setSelectedChart(diceSize);
    if (diceSize !== 20) {
      setSelectedRollTypes(allRollTypes);
      setActiveDiceRollData(diceRolls);
    }
  };

  const handleRollTypeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  useEffect(() => {
    if (selectedChart === 20 && selectedRollTypes.length > 0) {
      const filteredData = diceRolls.filter((roll) =>
        selectedRollTypes.includes(roll.rollType!)
      );
      setActiveDiceRollData(filteredData);
    }
  }, [selectedRollTypes, selectedChart, diceRolls]);

  const handleAccordionToggle = () => {
    setFilterAccordionOpen(!filterAccordionOpen);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#e0e0e0",
          padding: "15px",
          borderRadius: "5px",
          color: "#333333",
        }}
      >
        {/* <Typography variant="h6">Select Chart</Typography> */}
        <FormControl style={{ width: "150px" }}>
          <InputLabel id="dice-size-select-label">Dice Size</InputLabel>
          <Select
            labelId="dice-size-select-label"
            label="Dice Size"
            value={selectedChart || ""}
            onChange={handleChartSelect}
            className="dice-size-dropdown"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#e0e0e0",
                },
              },
            }}
          >
            <MenuItem value={20}>D-20</MenuItem>
            <MenuItem value={12}>D-12</MenuItem>
            <MenuItem value={10}>D-10</MenuItem>
            <MenuItem value={8}>D-8</MenuItem>
            <MenuItem value={6}>D-6</MenuItem>
            <MenuItem value={4}>D-4</MenuItem>
          </Select>
        </FormControl>

        {selectedChart === 20 && !isMobile && (
          <FormGroup>
            {/* <Typography variant="subtitle1">Filter Roll Types</Typography> */}
            <div className="checkbox-container">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allRollTypes.every((type) =>
                      selectedRollTypes.includes(type)
                    )}
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
            </div>
          </FormGroup>
        )}

        {selectedChart === 20 && isMobile && (
          <Accordion
            expanded={filterAccordionOpen}
            onChange={handleAccordionToggle}
            className="accordion-container"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="checkbox-container">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allRollTypes.every((type) =>
                        selectedRollTypes.includes(type)
                      )}
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
                      checked={selectedRollTypes.includes(
                        "Ability/Skill Check"
                      )}
                      onChange={handleRollTypeFilterChange}
                      name="Ability/Skill Check"
                    />
                  }
                  label="Ability/Skill Check"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRollTypes.includes(
                        "Attack/Spell Damage"
                      )}
                      onChange={handleRollTypeFilterChange}
                      name="Attack/Spell Damage"
                    />
                  }
                  label="Attack/Spell Damage"
                />
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        {selectedChart && (
          <RollTrendsLineChart
            data={rollTrendsByDiceSize[selectedChart]}
            title={`D-${selectedChart} Roll Trends`}
          />
        )}
      </Box>
    </>
  );
}
