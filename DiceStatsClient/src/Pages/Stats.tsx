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
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "../Styles/Stats.css";
import PageContent from "../Components/PageContent";
import BackButtonContainer from "../Components/BackButtonContainer";
import dayjs, { Dayjs } from "dayjs";

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
  const [startDate, setStartDate] = useState<null | Dayjs>(null);
  const [endDate, setEndDate] = useState<null | Dayjs>(null);

  useEffect(() => {
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });

    api.get("/diceroll").then((response) => {
      setDiceRollData(response.data);
      console.log("DATA: ", response.data);
    });
  }, []);

  useEffect(() => {
    let filteredData = diceRollData;

    if (selectedCharacter) {
      filteredData = filteredData.filter(
        (roll) => roll.characterId === selectedCharacter.characterId
      );
    }

    // Filter by date range if both startDate and endDate are set
    if (startDate && endDate) {
      filteredData = filteredData.filter((roll) => {
        const rollDate = dayjs(roll.timestamp);

        return (
          rollDate.isAfter(startDate, "day") &&
          rollDate.isBefore(endDate, "day")
        );
      });
    } else if (startDate) {
      filteredData = filteredData.filter((roll) => {
        const rollDate = dayjs(roll.timestamp);

        return rollDate.isAfter(startDate, "day");
      });
    } else if (endDate) {
      filteredData = filteredData.filter((roll) => {
        const rollDate = dayjs(roll.timestamp);

        return rollDate.isBefore(endDate, "day");
      });
    }
    setActiveDiceRollData(filteredData);
  }, [selectedCharacter, diceRollData, startDate, endDate]);

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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Range Start"
            sx={{
              ".MuiInputBase-root": {
                backgroundColor: "#e0e0e0",
                width: "200px",
                margin: {
                  xs: "5px 0 0 0",
                  md: "10px",
                },
              },
            }}
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Range End"
            sx={{
              ".MuiInputBase-root": {
                backgroundColor: "#e0e0e0",
                width: "200px",
                margin: {
                  xs: "5px 0",
                  md: "10px",
                },
              },
            }}
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
          />
        </LocalizationProvider>
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
                ".MuiTab-root": { color: "#e0e0e0" },
                ".Mui-selected": { color: "#ffffff" },
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
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#e0e0e0",
                },
              },
            }}
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
