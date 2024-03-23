import React, { Component } from "react";
import { getData } from "./request/api";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import "./App.css";

// Ideally, move this to its own file
const Dropdown = ({ label, options, onChange }) => (
  <select onChange={onChange}>
    <option value="">{label}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

class App extends Component {
  state = {
    data: [],
    filteredData: [],
    filters: { homeOwnership: "", quarter: "", term: "", year: "" },
  };

  async componentDidMount() {
    const fetchedData = await getData();
    this.setState({ data: fetchedData, filteredData: fetchedData });
  }

  getUniqueValues = (key) => {
    const unique = new Set(this.state.data.map((item) => item[key]));
    return [...unique];
  };

  filterData = () => {
    const { data, filters } = this.state;
    const filteredData = data.filter((item) => {
      return Object.keys(filters).every(
        (key) => filters[key] === "" || item[key].toString() === filters[key]
      );
    });
    this.setState({ filteredData });
  };

  aggregateDataByGrade = () => {
    const { filteredData } = this.state;
    const aggregatedData = {};

    // Aggregate current balance by grade
    filteredData.forEach((item) => {
      // Check if item.grade is not undefined or null before calling trim()
      const grade = `Grade ${item.grade ? item.grade.trim() : ""}`;
      const currentBalance = parseFloat(item.currentBalance);

      if (aggregatedData.hasOwnProperty(grade)) {
        aggregatedData[grade] += currentBalance;
      } else {
        aggregatedData[grade] = currentBalance;
      }
    });

    return aggregatedData;
  };

  handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    this.setState(
      (prevState) => ({
        filters: { ...prevState.filters, [filterName]: value },
      }),
      this.filterData
    );
  };

  resetFilters = () => {
    this.setState({
      filters: { homeOwnership: "", quarter: "", term: "", year: "" },
      filteredData: this.state.data,
    });
  };

  renderBarChart = () => {
    return (
      <BarChart width={600} height={300} data={this.state.filteredData}>
        <XAxis dataKey="grade" />
        <YAxis />
        <Bar dataKey="currentBalance" fill="#8884d8" />
      </BarChart>
    );
  };

  renderTable = () => {
    const aggregatedData = this.aggregateDataByGrade();
    const grades = Object.keys(aggregatedData).sort(); // Sort the grades to display in order

    return (
      <table>
        <thead>
          <tr>
            {grades.map((grade) => (
              <th key={grade}>{grade}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {grades.map((grade) => (
              <td key={grade}>${aggregatedData[grade].toFixed(2)}</td> // Format the balance as currency
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    const homeOwnerships = this.getUniqueValues("homeOwnership");
    const quarters = this.getUniqueValues("quarter");
    const terms = this.getUniqueValues("term");
    const years = this.getUniqueValues("year");

    console.log(this.aggregateDataByGrade());
    console.log(this.state.filteredData);
    console.log(this.state.data);

    return (
      <div className="App">
        <Dropdown
          label="Home Ownership"
          options={homeOwnerships}
          onChange={this.handleFilterChange("homeOwnership")}
        />
        <Dropdown
          label="Quarter"
          options={quarters}
          onChange={this.handleFilterChange("quarter")}
        />
        <Dropdown
          label="Term"
          options={terms}
          onChange={this.handleFilterChange("term")}
        />
        <Dropdown
          label="Year"
          options={years}
          onChange={this.handleFilterChange("year")}
        />
        <button onClick={this.resetFilters}>Reset Filters</button>
        {this.renderTable()}
        {this.renderBarChart()}
      </div>
    );
  }
}

export default App;
