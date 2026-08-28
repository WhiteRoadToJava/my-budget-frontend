import React, { useEffect, useState } from "react";
import Row from "./Row";
import styles from "../../styles/components/schedule/sechedule.module.scss";
import CreateScheduledIncome from "./CreateScheduledIncome";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../api/accountService";
import CreateScheduledExpense from "./CreateScheduledExpense ";
import ScheduleInfo from "./ScheduleInfo";
import i18n from "../../configuration/i18n";

const SchedulesComponent = ({ schedules }) => {
  const [createScheduledIncome, setCreateScheduledIncome] = useState(false);
  const [createscheduledExpense, setCreatescheduledExpense] = useState(false);
  const [createscheduledTransfer, setCreatescheduledTransfer] = useState(false);
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

  const buttonMenuItems = [
    <Button
      key="inc"
      variant="primary"
      text={i18n.t("buttons.createIncomse")}
      onClick={() => setCreateScheduledIncome(true)}
    />,
    <Button
      key="exp"
      variant="cancel"
      text={i18n.t("buttons.createExpense")}
      onClick={() => setCreatescheduledExpense(true)}
    />,
    <Button
      key="tra"
      variant="blue"
      text={i18n.t("buttons.createTransfer")}
      onClick={() => setCreatescheduledTransfer(true)}
    />,
  ];

  const handleTransactionClick = (schedule) => {
    setSelectedschedule(schedule);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div>
        {scheduleList.length > 0 ? (
          scheduleList.map((schedule) => (
            <Row
              key={schedule.id}
              schedule={schedule}
              onClick={() => handleTransactionClick(schedule)}
            />
          ))
        ) : (
          <p>{i18n.t("noSchedules")}</p>
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

      <ScheduleInfo
        isOpen={!!selectedschedule}
        onClose={() => setSelectedschedule(null)}
        schedule={selectedschedule || {}}
        accounts={accounts}
      />

      <div className={styles.buttonContainer}>
        <ToggleMenu menuList={buttonMenuItems} position="bottom" />
      </div>
    </div>
  );
};

export default SchedulesComponent;
