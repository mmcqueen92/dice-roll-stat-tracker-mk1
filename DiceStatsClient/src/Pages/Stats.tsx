import React, { useState, useEffect, SyntheticEvent } from "react";
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
// Import your chart library and tab navigation components here
// Example: import { LineChart, BarChart } from 'chart-library';
// Example: import { Tabs, Tab } from 'tab-navigation-library';
import api from "../Utils/api"; // Adjust the import path as needed
import CharacterData from "../Interfaces/CharacterData"; // Adjust the import path as needed

type TabValue =
  | "overview"
  | "dice-types"
  | "d20-rolls"
  | "trends"
  | "success-rates";

export default function StatsPage() {
  const [currentTab, setCurrentTab] = useState<TabValue>("overview");
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);

  useEffect(() => {
    // Fetch all characters for the user
    api.get(`/character`).then((response) => {
      setCharacters(response.data);
    });
  }, []);

  useEffect(() => {
    // Fetch rolls when the selected character changes
    const fetchData = () => {
      const url =
        selectedCharacter === null
          ? `/diceroll`
          : `/diceroll/${selectedCharacter.characterId}`;
      api.get(url).then((response) => {
        console.log("DICEROLL RESPONSE: ", response)
        // Process and set data for charts
        // Example: setAverageRollsData(response.data.averageRolls);
      });
    };

    fetchData();
  }, [selectedCharacter]);

  const handleTabChange = (event: SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
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
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dice Roll Stats
        </Typography>

        {/* Character Selection Dropdown */}
        <Select
          value={
            selectedCharacter ? selectedCharacter.characterId.toString() : ""
          }
          onChange={handleCharacterChange}
          displayEmpty
          inputProps={{ "aria-label": "Select Character" }}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All Characters</MenuItem>
          {characters.map((character) => (
            <MenuItem key={character.characterId} value={character.characterId}>
              {character.name}
            </MenuItem>
          ))}
        </Select>

        {/* Date Range Picker */}
        {/* Implement your date range picker here */}

        {/* Tab Navigation */}
        {/* Replace with your tab navigation component */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/* Example Tab Navigation */}
          {/* <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Overview" value="overview" />
            <Tab label="Dice Types" value="dice-types" />
            <Tab label="d20 Rolls" value="d20-rolls" />
            <Tab label="Trends" value="trends" />
            <Tab label="Success Rates" value="success-rates" />
          </Tabs> */}
        </Box>

        {/* Tab Content */}
        <Box>
          {currentTab === "overview" && (
            <Grid container spacing={2}>
              {/* Example Overview Content */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">Average Rolls</Typography>
                  {/* Replace with your chart component */}
                  {/* <BarChart data={averageRollsData} /> */}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6">Total Rolls</Typography>
                  {/* Replace with your chart component */}
                  {/* <PieChart data={totalRollsData} /> */}
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "dice-types" && (
            <Grid container spacing={2}>
              {/* Example Dice Types Content */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">
                    Average Rolls by Dice Type
                  </Typography>
                  {/* Replace with your chart component */}
                  {/* <BarChart data={averageRollsByTypeData} /> */}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">
                    Roll Distribution by Dice Type
                  </Typography>
                  {/* Replace with your chart component */}
                  {/* <Histogram data={rollDistributionByTypeData} /> */}
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "d20-rolls" && (
            <Grid container spacing={2}>
              {/* Example d20 Rolls Content */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">
                    Average Rolls by Category
                  </Typography>
                  {/* Replace with your chart component */}
                  {/* <BarChart data={averageRollsByCategoryData} /> */}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">
                    Success Rates by Category
                  </Typography>
                  {/* Replace with your chart component */}
                  {/* <PieChart data={successRatesByCategoryData} /> */}
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "trends" && (
            <Grid container spacing={2}>
              {/* Example Trends Content */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">Roll Trends Over Time</Typography>
                  {/* Replace with your chart component */}
                  {/* <LineChart data={rollTrendsData} /> */}
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === "success-rates" && (
            <Grid container spacing={2}>
              {/* Example Success Rates Content */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="h6">Success Rates</Typography>
                  {/* Replace with your chart component */}
                  {/* <PieChart data={successRatesData} /> */}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}
