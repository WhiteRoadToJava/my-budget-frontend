import React, { useState, useMemo} from "react";
import Row from "./Row";
import styles from "../../styles/rapport/rapport.module.scss";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import sortingTransactions from "../../utils/sorting";

const RapportComponent = ({ data = [], setFromDate, setToDate, search }) => {
  const [fromDate, setFromDateState] = useState(null);
  const [toDate, setToDateState] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = async () => {
    if (fromDate && toDate) {
      setFromDate(fromDate);
      setToDate(toDate);
      console.log("fromDate:", fromDate);
      console.log("toDate:", toDate);
      await search();
    }
  };
  useMemo (() => {
      const sortedData = sortingTransactions(data);
      setFilteredData(sortedData);
    }, [data]);

  return (
    <div>
      <h2>Rapport</h2>
      <div className={styles.header}>
        <div className={styles.datepickerContainer}>
          <Datepicker
            label="From: "
            value={fromDate}
            onChange={(data) => setFromDateState(data)}
          />
        </div>
        <div className={styles.datepickerContainer}>
          <Datepicker
            label="To: "
            value={toDate}
            onChange={(data) => setToDateState(data)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button text="Search" onClick={() => handleSearch()} />
        </div>
        <div className={styles.divider}></div>
      </div>
      {/* Render the rapport data here */}
      <div>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => <Row key={index} item={item} />)
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default RapportComponent;
