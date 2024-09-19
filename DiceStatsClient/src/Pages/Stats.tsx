import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Container,
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  Paper,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../Utils/api";
import CharacterData from "../Interfaces/CharacterData";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionRollTrends from "../Components/StatsSectionRollTrends";
import StatsSectionRollDistribution from "../Components/StatsSectionRollDistribution";
import StatsSectionRollTypes from "../Components/StatsSectionRollTypes";
import StatsSectionOverview from "../Components/StatsSectionOverview";

import "../Styles/Stats.css";

type TabValue = "overview" | "trends" | "roll distribution" | "roll types";

export default function StatsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentTab, setCurrentTab] = useState<TabValue>("overview");
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [diceRollData, setDiceRollData] = useState<DiceRollData[]>([]);
  const [activeDiceRollData, setActiveDiceRollData] = useState<DiceRollData[]>(
    []
  );
  const [accordionOpen, setAccordionOpen] = useState(false);

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

  const handleTabChange = (event: SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
    if (isMobile) {
      setAccordionOpen(false); // Automatically close the accordion when a tab is selected on mobile
    }
  };

  const handleCharacterChange = (event: SelectChangeEvent<string>) => {
    const selectedCharacterId = parseInt(event.target.value);
    const selectedCharacter =
      characters.find(
        (character) => character.characterId === selectedCharacterId
      ) || null;
    setSelectedCharacter(selectedCharacter);
  };

  const handleAccordionToggle = () => {
    setAccordionOpen(!accordionOpen); // Toggle accordion open/close state
  };

  return (
    <Container disableGutters>
      <Paper className="page-content">
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

        <Box>
          {!isMobile ? (
            // Show regular horizontal tabs for desktop view
            <Box className="tabs-container">
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                aria-label="stats navigation tabs"
                centered
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Roll Trends" value="trends" />
                <Tab label="Roll Distribution" value="roll distribution" />
                <Tab label="Roll Types" value="roll types" />
              </Tabs>
            </Box>
          ) : (
            // Accordion for mobile view
            <Accordion
              expanded={accordionOpen}
              onChange={handleAccordionToggle}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Sections</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  orientation="vertical"
                  variant="standard"
                  aria-label="stats navigation tabs mobile"
                >
                  <Tab label="Overview" value="overview" />
                  <Tab label="Roll Trends" value="trends" />
                  <Tab label="Roll Distribution" value="roll distribution" />
                  <Tab label="Roll Types" value="roll types" />
                </Tabs>
              </AccordionDetails>
            </Accordion>
          )}

          <Box>
            {currentTab === "overview" && (
              <StatsSectionOverview diceRolls={activeDiceRollData} />
            )}

            {currentTab === "trends" && (
              <StatsSectionRollTrends diceRolls={activeDiceRollData} />
            )}

            {currentTab === "roll distribution" && (
              <StatsSectionRollDistribution diceRolls={activeDiceRollData} />
            )}

            {currentTab === "roll types" && (
              <StatsSectionRollTypes diceRolls={activeDiceRollData} />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
