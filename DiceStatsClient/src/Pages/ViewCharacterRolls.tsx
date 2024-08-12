import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../Utils/api"; // Import your API utility
// import DiceRoll from "../Interfaces/DiceRoll";
import DiceRollData from "../Interfaces/DiceRollData";
import EditDiceRollForm from "../Components/EditDiceRollForm";
import {
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  // Button,
  // Select,
  // MenuItem,
  // TextField,
  Dialog,
} from "@mui/material";
import CharacterData from "../Interfaces/CharacterData";

// Dummy filter options
const rollTypes = [
  "Attack",
  "Skill Check",
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
];

export default function ViewCharacterRolls() {
  const { id } = useParams<{ id: string }>();
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [rolls, setRolls] = useState<DiceRollData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    // dateRange: { start: "", end: "" },
    rollType: "",
    diceSize: "",
    skillType: "",
    // rollValueMin: "",
    // rollValueMax: "",
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
          params: { ...filters, skip: (page - 1) * pageSize, limit: pageSize },
        });
        response.data.forEach((roll) => delete roll.character)
        setRolls(response.data);

        const countResponse = await api.get<number>(`/diceroll/${id}/count`);
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page on page size change
  };

  const handleEditClick = (roll: DiceRollData) => {
    setEditRoll(roll);
    // setIsEditing(true);
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

      {/* Filter Section */}
      <div>
        <h3>Filters</h3>
        <form>
          {/* <div>
            <label>Date Range:</label>
            <input
              type="date"
              name="start"
              value={filters.dateRange.start}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="end"
              value={filters.dateRange.end}
              onChange={handleFilterChange}
            />
          </div> */}
          <div>
            <label>Roll Type:</label>
            {rollTypes.map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="rollType"
                  value={type}
                  checked={filters.rollType === type}
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
              {skillTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* <div>
            <label>Roll Value Range:</label>
            <input
              type="number"
              name="rollValueMin"
              value={filters.rollValueMin}
              onChange={handleFilterChange}
              placeholder="Min"
            />
            <input
              type="number"
              name="rollValueMax"
              value={filters.rollValueMax}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </div> */}
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

      {/* Rolls List */}
      <div>
        <h3>Rolls</h3>
        {loading && <p>Loading rolls...</p>}
        {error && <p>{error}</p>}
        {rolls.length === 0 && !loading && !error && <p>No rolls found.</p>}
        {rolls.length > 0 && (
          <ul>
            {rolls.map((roll) => (
              <li key={roll.diceRollId}>
                Dice Size: {roll.diceSize}, Roll Value: {roll.rollValue}, Roll
                Type: {roll.rollType}
                {roll.success === true && " - Success"}
                {roll.success === false && " - Fail"}
                {(roll.rollType === "Skill Check" ||
                  roll.rollType === "Saving Throw") && (
                  <> - Skill Type: {roll.skillType}</>
                )}
                <button onClick={() => handleEditClick(roll)}>Edit</button>
              </li>
            ))}
          </ul>
        )}

        {totalRecords > 0 && (
          <div>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page: {page} of {Math.ceil(totalRecords / pageSize)}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * pageSize >= totalRecords}
            >
              Next
            </button>
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Edit Roll Modal */}
      <Dialog open={editRoll !== null} onClose={handleCancelEdit}>
        {editRoll && (
          <EditDiceRollForm
            roll={editRoll}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </Dialog>
    </div>
  );
}
