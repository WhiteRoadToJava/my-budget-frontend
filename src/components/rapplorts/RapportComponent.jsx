import React, { useState, useMemo } from "react";
import Row from "./Row";
import styles from "../../styles/rapport/rapport.module.scss";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import sortingTransactions from "../../utils/sorting";
import i18n from "../../configuration/i18n";
import Modal from "../modals/Modal";
import { getTransactionsBetweenTwoDates } from "../../api/rapportService";

const RapportComponent = () => {
  const [fromDate, setFromDateState] = useState(null);
  const [toDate, setToDateState] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (fromDate && toDate) {
      setIsLoading(true);
      getTransactionsBetweenTwoDates(fromDate, toDate);
      setIsLoading(false);
      try {
        await search();
      } catch (err) {
        setError(i18n.t("messages.search_error"));
      } finally {
        setIsLoading(false);
      }
    }
  };
  useMemo(() => {
    const sortedData = sortingTransactions(data);
    setFilteredData(sortedData);
  }, [data]);

  return (
    <div>
      <h2>Rapport</h2>
      <div className={styles.header}>
        <div className={styles.header}>
          <div>
            <p>Fromt Date:</p>
            <Datepicker
              label="From: "
              value={fromDate}
              onChange={(data) => setFromDateState(data)}
            />
          </div>
          <div>
            <p>To Date:</p>
            <Datepicker
              label="To: "
              value={toDate}
              onChange={(data) => setToDateState(data)}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button text="Search" onClick={handleSearch} />
        </div>
        <div className={styles.divider}></div>
      </div>
      {/* Render the rapport data here */}
      <div>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => <Row key={index} item={item} />)
        ) : (
          <div className={styles.dataModal} 
            >
            {i18n.t("messages.noData")}
            <Modal isOpen={isLoading || error} onRequestClose={() => {}}>
              <div>
                <p style={{ padding: "20px", textAlign: "center" }}>
                  {isLoading
                    ? i18n.t("messages.loading")
                    : i18n.t("messages.no_data_available")}
                </p>
                <Button text="Close" variant="cancel" onClick={() => {setIsLoading(false); setError(null)}} />
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default RapportComponent;
