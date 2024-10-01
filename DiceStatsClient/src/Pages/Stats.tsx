import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import api from "../Utils/api";
import CharacterData from "../Interfaces/CharacterData";
import DiceRollData from "../Interfaces/DiceRollData";
import StatsSectionRollTrends from "../Components/StatsSectionRollTrends";
import StatsSectionRollDistribution from "../Components/StatsSectionRollDistribution";
import StatsSectionRollTypes from "../Components/StatsSectionRollTypes";
import StatsSectionOverview from "../Components/StatsSectionOverview";
import { useRedirectIfUnauthenticated } from "../Hooks/useRedirectIfUnauthenticated";

import "../Styles/Stats.css";
import PageContent from "../Components/PageContent";
import BackButtonContainer from "../Components/BackButtonContainer";

type TabValue = "overview" | "trends" | "roll distribution" | "roll types";

export default function StatsPage() {
  useRedirectIfUnauthenticated();
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

  useEffect(() => {
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });

    api.get("/diceroll").then((response) => {
      setDiceRollData(response.data);
      console.log("DATA: ", response.data)
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
  };

  const handleDropdownChange = (event: SelectChangeEvent<TabValue>) => {
    setCurrentTab(event.target.value as TabValue);
  };

  const handleCharacterChange = (event: SelectChangeEvent<string>) => {
    const selectedCharacterId = parseInt(event.target.value);
    const selectedCharacter =
      characters.find(
        (character) => character.characterId === selectedCharacterId
      ) || null;
    setSelectedCharacter(selectedCharacter);
  };

  return (
    <PageContent>
      <BackButtonContainer route="/user-dashboard"></BackButtonContainer>
      <Typography variant="h5">Statistics</Typography>
      <Box>
        <Select
          className="character-select"
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
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#e0e0e0",
              },
            },
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
          <Box className="tabs-container">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="stats navigation tabs"
              centered
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                ".MuiTab-root": { color: "#e0e0e0" }, // Off-white text color for unselected tabs
                ".Mui-selected": { color: "#ffffff" }, // Brighter white for the selected tab
              }}
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Roll Trends" value="trends" />
              <Tab label="Roll Distribution" value="roll distribution" />
              <Tab label="Roll Types" value="roll types" />
            </Tabs>
          </Box>
        ) : (
          <Select
            value={currentTab}
            onChange={handleDropdownChange}
            className="mobile-section-dropdown"
          >
            <MenuItem value="overview">Overview</MenuItem>
            <MenuItem value="trends">Roll Trends</MenuItem>
            <MenuItem value="roll distribution">Roll Distribution</MenuItem>
            <MenuItem value="roll types">Roll Types</MenuItem>
          </Select>
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
    </PageContent>
  );
}
