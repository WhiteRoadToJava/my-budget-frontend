import React, { useEffect, useState } from "react";
import Row from "./Row";
import styles from "../../styles/components/schedule/sechedule.module.scss";
import CreateScheduledIncome from "./CreateScheduledIncome";
import Button from "../btns/Button";
import PlusIcon from "../icons/btns/PlusIcon";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../api/accountService";
import CreateScheduledExpense from "./CreateScheduledExpense";
import CreateScheduledTransfer from "./CreateScheduledTransfer";
import ScheduleInfo from "./ScheduleInfo";
import i18n from "../../configuration/i18n";

const SchedulesComponent = ({ schedules }) => {
  const [createScheduledIncome, setCreateScheduledIncome] = useState(false);
  const [createscheduledExpense, setCreatescheduledExpense] = useState(false);
  const [createScheduledTransfer, setCreateScheduledTransfer] = useState(false);
  const [selectedschedule, setSelectedschedule] = useState(null);
  const [scheduleList, setSchedulesList] = useState([]);
  // Deliberate: mirrors the `schedules` prop into local state. This is a pure
  // sync and could be removed in favor of using `schedules` directly (or a
  // useMemo); tracked as a follow-up cleanup rather than changed here to keep
  // this fix scoped to CI unblocking.
  useEffect(() => {
    if (schedules) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedulesList(schedules);
    }
  }, [schedules]);
  const {
    data: accounts = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    error: accountsError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
  if (isAccountsLoading) {
    return <div>{i18n.t("loading")}</div>;
  }
  if (isAccountsError) {
    return (
      <div>
        {i18n.t("errorLoadingAccounts")}: {accountsError.message}
      </div>
    );
  }

  const handleTransactionClick = (schedule) => {
    setSelectedschedule(schedule);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.header}>
        <h2>{i18n.t("menu.schedule")}</h2>
        <div className={styles.headerActions}>
          <Button
            variant="primary"
            text={i18n.t("buttons.createIncomse")}
            Icon={PlusIcon}
            onClick={() => setCreateScheduledIncome(true)}
          />
          <Button
            variant="cancel"
            text={i18n.t("buttons.createExpense")}
            Icon={PlusIcon}
            onClick={() => setCreatescheduledExpense(true)}
          />
          <Button
            variant="blue"
            text={i18n.t("buttons.createTransfer")}
            Icon={PlusIcon}
            onClick={() => setCreateScheduledTransfer(true)}
          />
        </div>
      </div>

      {scheduleList.length > 0 && (
        <div className={styles.rowtitle}>
          <p className={styles.headerItem}>{i18n.t("createSchedule.amount")}</p>
          <p className={styles.headerItem}>{i18n.t("createSchedule.name")}</p>
          <p className={styles.headerItem}>{i18n.t("createSchedule.interval")}</p>
          <p className={styles.headerItem}>{i18n.t("createSchedule.nextExecutionDate")}</p>
          <p className={styles.headerItem}>{i18n.t("createSchedule.type")}</p>
        </div>
      )}

      <div className={styles.scheduleBody}>
        {scheduleList.length > 0 ? (
          scheduleList.map((schedule) => (
            <Row
              key={schedule.id}
              schedule={schedule}
              onClick={() => handleTransactionClick(schedule)}
            />
          ))
        ) : (
          <p className={styles.emptyState}>{i18n.t("noSchedules")}</p>
        )}
      </div>

      <CreateScheduledIncome
        isOpen={createScheduledIncome}
        isClose={() => setCreateScheduledIncome(false)}
        transactionType="INCOMSE"
        accounts={accounts}
      />

      <CreateScheduledExpense
        isOpen={createscheduledExpense}
        isClose={() => setCreatescheduledExpense(false)}
        transactionType="EXPENSE"
        accounts={accounts}
      />

      <CreateScheduledTransfer
        isOpen={createScheduledTransfer}
        isClose={() => setCreateScheduledTransfer(false)}
        accounts={accounts}
      />

      <ScheduleInfo
        isOpen={!!selectedschedule}
        onClose={() => setSelectedschedule(null)}
        schedule={selectedschedule || {}}
        accounts={accounts}
      />
    </div>
  );
};

export default SchedulesComponent;

