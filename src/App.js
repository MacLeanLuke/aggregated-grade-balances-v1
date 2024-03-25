import "./App.css";
import React, { useState, useEffect } from "react";
import { getData } from "./request/api";
import { Dropdown, Table, Barchart } from "./components";

// Main App component that handles data fetching, filtering, and visualization
const App = () => {
  // State initialization with data, filteredData, and filters
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    homeOwnership: "",
    quarter: "",
    term: "",
    year: "",
  });

  useEffect(() => {
    const fetchAndSetData = async () => {
      const fetchedData = await getData();
      setData(fetchedData);
      setFilteredData(fetchedData);
    };

    fetchAndSetData();
  }, []);

  // Helper function to get unique values from the data for dropdown options
  const getUniqueValues = (key) => {
    // Create a set with unique values and convert it back to an array
    const unique = new Set(data.map((item) => item[key]).filter(Boolean));
    return [...unique];
  };

  // Method to filter the data based on selected dropdown options
  const filterData = () => {
    // Filter the data according to the current filters
    const filteredData = data.filter((item) => {
      // Check if all filters match the item's properties
      return Object.keys(filters).every((key) => {
        const itemValue = item[key];
        const filterValue = filters[key];

        // Return true if the filter is empty or the values match
        return (
          filterValue === "" ||
          (itemValue != null && itemValue.toString() === filterValue)
        );
      });
    });

    // Update the state with the new filtered data
    setFilteredData(filteredData);
  };

  // Method to aggregate data by grade after filtering
  const aggregateDataByGrade = () => {
    const aggregatedData = {};

    // Accumulate total balances for each grade
    filteredData.forEach((item) => {
      // Only proceed if grade and currentBalance are valid
      if (item.grade && item.currentBalance) {
        const grade = `Grade ${item.grade.trim()}`;
        const currentBalance = parseFloat(item.currentBalance);

        // Add balance to the corresponding grade if it's a valid number
        if (!isNaN(currentBalance)) {
          if (!aggregatedData[grade]) {
            aggregatedData[grade] = 0;
          }
          aggregatedData[grade] += currentBalance;
        }
      }
    });
    // Sort the aggregated data by grade and convert to array
    return Object.entries(aggregatedData)
      .sort((a, b) => {
        // Extract the numeric part of the grade and convert to number for sorting
        const gradeANumber = parseInt(a[0].replace("Grade ", ""), 10);
        const gradeBNumber = parseInt(b[0].replace("Grade ", ""), 10);
        return gradeANumber - gradeBNumber;
      })
      .map(([grade, totalBalance]) => {
        // Return the aggregated data with parsed total balances
        return {
          grade,
          totalBalance:
            typeof totalBalance === "number"
              ? totalBalance
              : parseFloat(totalBalance),
        };
      });
  };

  // Event handler for filter change, updates state with new filter value
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    setFilters({ ...filters, [filterName]: value });
  };

  // Update filtered data whenever filters change
  useEffect(() => {
    filterData();
  }, [filters]);

  // Method to reset all filters to their default values
  const resetFilters = () => {
    setFilters({ homeOwnership: "", quarter: "", term: "", year: "" });
    setFilteredData(data); // Reset the filteredData to the original data set
  };

  // Pre-calculate aggregated data for the table and bar chart
  const aggregatedData = aggregateDataByGrade();
  // Get unique values for each filter to populate dropdowns
  const homeOwnerships = getUniqueValues("homeOwnership");
  const quarters = getUniqueValues("quarter");
  const terms = getUniqueValues("term");
  const years = getUniqueValues("year");

  // JSX to render the application's UI components
  return (
    <div className="App">
      <h1>Loan Analysis Dashboard</h1>
      <div style={{ marginBottom: "2rem" }}>
        <Dropdown
          label="Home Ownership"
          options={homeOwnerships}
          onChange={handleFilterChange("homeOwnership")}
          value={filters.homeOwnership}
        />
        <Dropdown
          label="Quarter"
          options={quarters}
          onChange={handleFilterChange("quarter")}
          value={filters.quarter}
        />
        <Dropdown
          label="Term"
          options={terms}
          onChange={handleFilterChange("term")}
          value={filters.term}
        />
        <Dropdown
          label="Year"
          options={years}
          onChange={handleFilterChange("year")}
          value={filters.year}
        />
        <button className="resetButton" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      {filteredData.length === 0 ? (
        <p className="no-data-message">
          No data available for the selected filters.
        </p>
      ) : (
        <>
          <Barchart aggregatedData={aggregatedData} />
          <Table aggregatedData={aggregatedData} />
        </>
      )}
    </div>
  );
};
// }

export default App;
