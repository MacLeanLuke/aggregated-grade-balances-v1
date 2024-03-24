import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3E5C76",
  "#5D7B89",
  "#739E82",
  "#A3B1AC",
  "#C9D5B5",
  "#E2C275",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`${label} : $${payload[0].value.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`}</p>
      </div>
    );
  }

  return null;
};

// Barchart component that takes in aggregatedData and renders a bar chart
// It uses the Recharts library components to create a visualization
const Barchart = ({ aggregatedData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={aggregatedData}>
        <XAxis dataKey="grade" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="totalBalance" fill="#8884d8">
          {aggregatedData.map((entry, index) => (
            // Map over the aggregatedData array and create a Cell component for each item
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Barchart;
