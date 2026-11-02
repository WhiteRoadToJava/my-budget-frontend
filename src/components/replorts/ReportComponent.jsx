import React, { useState, useMemo } from "react";
import Row from "./Row";
import styles from "../../styles/report/report.module.scss";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import sortingTransactions from "../../utils/sorting";
import i18n from "../../configuration/i18n";
import Modal from "../modals/Modal";
import { getTransactionsBetweenTwoDates } from "../../api/reportService";

const ReportComponent = () => {
  const [fromDate, setFromDateState] = useState(null);
  const [toDate, setToDateState] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if(fromDate && toDate){
      setIsLoading(true);
      const transactions = await getTransactionsBetweenTwoDates(fromDate, toDate);
      setData(transactions);
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
      <h2>report</h2>
      <div className={styles.header}>
        <div className={styles.header}>
          <div>
            <p>{i18n.t("report.fromDate")}</p>
            <Datepicker
              label={i18n.t("labels.fromDate")}
              value={fromDate}
              onChange={(data) => setFromDateState(data)}
            />
          </div>
          <div>
            <p>{i18n.t("report.toDate")}</p>
            <Datepicker
              label={i18n.t("report.toDate")}
              value={toDate}
              onChange={(data) => setToDateState(data)}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button text={i18n.t("report.search")} onClick={handleSearch} />
        </div>
        <div className={styles.divider}></div>
      </div>
      {/* Render the report data here */}
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

export default ReportComponent;
