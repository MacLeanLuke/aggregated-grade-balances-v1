import React from "react";
import styles from "./Table.module.css";

// Table component to display aggregated financial data
const Table = ({ aggregatedData }) => {
  return (
    // Use module classes for styling
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <td className={`${styles.td} ${styles.firstColumn}`}>Grade</td>
            {/* Mapping through each grade to create table headers */}
            {aggregatedData.map((data) => (
              <th key={data.grade} className={styles.th}>
                {data.grade}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table body with white and light gray zebra striping for rows */}
        <tbody>
          <tr className={styles.tr}>
            <td className={`${styles.td} ${styles.firstColumn}`}>Total</td>
            {/* Mapping through each grade to create table cells */}
            {aggregatedData.map((data) => (
              <td key={data.grade} className={styles.td}>
                $
                {data.totalBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
