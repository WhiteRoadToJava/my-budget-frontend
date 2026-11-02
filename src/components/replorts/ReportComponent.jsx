import React, { useState, useMemo } from "react";
import { addDays, format, parseISO } from "date-fns";
import Row from "./Row";
import styles from "../../styles/report/report.module.scss";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import sortingTransactions from "../../utils/sorting";
import i18n from "../../configuration/i18n";
import Modal from "../modals/Modal";
import { getTransactionsBetweenTwoDates } from "../../api/reportService";

const ReportComponent = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // derived from data, so no extra state or effect is needed
  const sortedData = useMemo(() => sortingTransactions(data), [data]);

  const handleSearch = async () => {
    if (!fromDate || !toDate) return;
    setIsLoading(true);
    setError(null);
    try {
      // the backend excludes the end date, so ask for the day after it
      // to include everything on the chosen "to" date
      const endExclusive = format(addDays(parseISO(toDate), 1), "yyyy-MM-dd");
      const transactions = await getTransactionsBetweenTwoDates(fromDate, endExclusive);
      setData(transactions ?? []);
    } catch {
      setError(i18n.t("messages.search_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setError(null);

  return (
    <div>
      <h2>{i18n.t("report.title")}</h2>
      <div className={styles.header}>
        <div className={styles.header}>
          <div>
            <p>{i18n.t("report.fromDate")}</p>
            <Datepicker
              label={i18n.t("report.fromDate")}
              value={fromDate}
              onChange={setFromDate}
            />
          </div>
          <div>
            <p>{i18n.t("report.toDate")}</p>
            <Datepicker
              label={i18n.t("report.toDate")}
              value={toDate}
              onChange={setToDate}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            text={i18n.t("report.search")}
            onClick={handleSearch}
            disabled={isLoading || !fromDate || !toDate}
          />
        </div>
        <div className={styles.divider}></div>
      </div>
      <div>
        {sortedData.length > 0 ? (
          sortedData.map((item) => <Row key={`${item.type}-${item.id}`} item={item} />)
        ) : (
          <div className={styles.dataModal}>{i18n.t("messages.noData")}</div>
        )}
        <Modal isOpen={isLoading || !!error} onClose={closeModal}>
          <div>
            <p style={{ padding: "20px", textAlign: "center" }}>
              {isLoading ? i18n.t("messages.loading") : error}
            </p>
            {!isLoading && (
              <Button text={i18n.t("buttons.close")} variant="cancel" onClick={closeModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ReportComponent;
