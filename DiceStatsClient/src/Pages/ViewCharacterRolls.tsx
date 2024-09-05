import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../Utils/api"; // Import your API utility
import DiceRollData from "../Interfaces/DiceRollData";
import EditDiceRollForm from "../Components/EditDiceRollForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  Dialog,
  TablePagination,
} from "@mui/material";
import CharacterData from "../Interfaces/CharacterData";

// Dummy filter options
const rollTypes = [
  "All",
  "Attack",
  "Ability/Skill Check",
  "Saving Throw",
  "Attack/Spell Damage",
];
const diceSizes = [4, 6, 8, 10, 12, 20];
const skillTypes = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

export default function ViewCharacterRolls() {
  const { id } = useParams<{ id: string }>();
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [rolls, setRolls] = useState<DiceRollData[]>([]);
  const [filteredRolls, setFilteredRolls] = useState<DiceRollData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    rollType: "",
    diceSize: "",
    skillType: "",
    success: "",
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [editRoll, setEditRoll] = useState<DiceRollData | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    const fetchRolls = async () => {
      setLoading(true);
      try {
        const response = await api.get<DiceRollData[]>(`/diceroll/${id}`, {
          params: {
            skip: (page - 1) * pageSize,
            limit: pageSize,
            rollType: filters.rollType || undefined,
            diceSize: filters.diceSize || undefined,
            skillType: filters.skillType || undefined,
            success: filters.success !== "" ? filters.success : undefined,
          },
        });

        response.data.forEach((roll) => delete roll.character);
        setRolls(response.data);

        const countResponse = await api.get<number>(`/diceroll/${id}/count`, {
          params: {
            rollType: filters.rollType || undefined,
            diceSize: filters.diceSize || undefined,
            skillType: filters.skillType || undefined,
            success: filters.success !== "" ? filters.success : undefined,
          },
        });

        setTotalRecords(countResponse.data);
      } catch (error) {
        setError("Error fetching rolls");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRolls();
  }, [filters, page, pageSize, id]);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const response = await api.get<CharacterData>(`/character/${id}`);
        setCharacterData(response.data);
      } catch (e) {
        console.error("Error fetching character data", e);
      }
    };

    fetchCharacterData();
  }, [id]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
    setPage(1);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleEditClick = (roll: DiceRollData) => {
    setEditRoll(roll);
  };

  const handleSaveEdit = async (updatedRoll: DiceRollData) => {
    try {
      await api.put(`/diceroll/${updatedRoll.diceRollId}`, updatedRoll);
      setRolls((prevRolls) =>
        prevRolls.map((roll) =>
          roll.diceRollId === updatedRoll.diceRollId ? updatedRoll : roll
        )
      );
      setEditRoll(null);
    } catch (error) {
      console.error("Error updating roll", error);
    }
  };

  const handleCancelEdit = () => {
    setEditRoll(null);
  };

  return (
    <div>
      {characterData && characterData.name && (
        <h1>View Rolls for {characterData.name}</h1>
      )}

      <div>
        <h3>Filters</h3>
        <form>
          <div>
            <label>Roll Type:</label>
            {rollTypes.map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="rollType"
                  value={type === "All" ? "" : type}
                  checked={filters.rollType === (type === "All" ? "" : type)}
                  onChange={handleFilterChange}
                />
                {type}
              </label>
            ))}
          </div>
          <div>
            <label>Dice Size:</label>
            <select
              name="diceSize"
              value={filters.diceSize}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              {diceSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Skill Type:</label>
            <select
              name="skillType"
              value={filters.skillType}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              {skillTypes
                .slice()
                .sort((a, b) => a.localeCompare(b))
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Success:</label>
            <select
              name="success"
              value={filters.success}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="true">Success</option>
              <option value="false">Failure</option>
            </select>
          </div>
        </form>
      </div>

      {/* Rolls Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll Type</TableCell>
              <TableCell>Skill Type</TableCell>
              <TableCell>Dice Size</TableCell>
              <TableCell>Roll Value</TableCell>
              <TableCell>Success</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>Loading rolls...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6}>{error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && rolls.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No rolls found.</TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              rolls.map((roll) => (
                <TableRow key={roll.diceRollId}>
                  <TableCell>{roll.rollType}</TableCell>
                  <TableCell>{roll.skillType}</TableCell>
                  <TableCell>{roll.diceSize}</TableCell>
                  <TableCell>{roll.rollValue}</TableCell>
                  <TableCell>{roll.success ? "Success" : "Fail"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(roll)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalRecords}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </TableContainer>

      {/* Edit Modal */}
      {editRoll && (
        <Dialog open={Boolean(editRoll)} onClose={handleCancelEdit}>
          <EditDiceRollForm
            roll={editRoll}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </Dialog>
      )}
    </div>
  );
}
