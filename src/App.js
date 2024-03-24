import "./App.css";
import React, { Component } from "react";
import { getData } from "./request/api";
import { Dropdown, Table, Barchart } from "./components";

// Main App component that handles data fetching, filtering, and visualization
class App extends Component {
  // State initialization with data, filteredData, and filters
  state = {
    data: [],
    filteredData: [],
    filters: { homeOwnership: "", quarter: "", term: "", year: "" },
  };

  // Lifecycle method that runs after the component mounts
  async componentDidMount() {
    // Fetch data from API and update state
    const fetchedData = await getData();
    this.setState({ data: fetchedData, filteredData: fetchedData });
  }

  // Helper function to get unique values from the data for dropdown options
  getUniqueValues = (key) => {
    // Create a set with unique values and convert it back to an array
    const unique = new Set(
      this.state.data.map((item) => item[key]).filter(Boolean)
    );
    return [...unique];
  };

  // Method to filter the data based on selected dropdown options
  filterData = () => {
    const { data, filters } = this.state;

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
    this.setState({ filteredData });
  };

  // Method to aggregate data by grade after filtering
  aggregateDataByGrade = () => {
    const { filteredData } = this.state;
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
  handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    this.setState(
      (prevState) => ({
        filters: { ...prevState.filters, [filterName]: value },
      }),

      // Callback to re-filter the data after state update
      this.filterData
    );
  };

  // Method to reset all filters to their default values
  resetFilters = () => {
    // Reset filters and use the original data set as filtered data
    this.setState({
      filters: { homeOwnership: "", quarter: "", term: "", year: "" },
      filteredData: this.state.data,
    });
  };

  // Render method to display the dropdowns, button, table, and bar chart
  render() {
    // Pre-calculate aggregated data for the table and bar chart
    const aggregatedData = this.aggregateDataByGrade();
    // Get unique values for each filter to populate dropdowns
    const homeOwnerships = this.getUniqueValues("homeOwnership");
    const quarters = this.getUniqueValues("quarter");
    const terms = this.getUniqueValues("term");
    const years = this.getUniqueValues("year");

    // JSX to render the application's UI components
    return (
      <div className="App">
        <h1>Loan Analysis Dashboard</h1>
        <div style={{ marginBottom: "2rem" }}>
          <Dropdown
            label="Home Ownership"
            options={homeOwnerships}
            onChange={this.handleFilterChange("homeOwnership")}
            value={this.state.filters.homeOwnership}
          />
          <Dropdown
            label="Quarter"
            options={quarters}
            onChange={this.handleFilterChange("quarter")}
            value={this.state.filters.quarter}
          />
          <Dropdown
            label="Term"
            options={terms}
            onChange={this.handleFilterChange("term")}
            value={this.state.filters.term}
          />
          <Dropdown
            label="Year"
            options={years}
            onChange={this.handleFilterChange("year")}
            value={this.state.filters.year}
          />
          <button className="resetButton" onClick={this.resetFilters}>
            Reset Filters
          </button>
        </div>
        {this.state.filteredData.length === 0 ? (
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
  }
}

export default App;
