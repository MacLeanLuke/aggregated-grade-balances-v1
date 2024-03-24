import React from "react";
import styles from "./Dropdown.module.css";

const Dropdown = ({ label, options, onChange, value }) => (
  // Use the styles object to apply class names
  <div className={styles.dropdown}>
    <select value={value} onChange={onChange} className={styles.select}>
      <option value="">{label}</option>
      {options.map((option, index) => (
        <option key={option + index} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className={styles.arrow} />{" "}
  </div>
);

export default Dropdown;
