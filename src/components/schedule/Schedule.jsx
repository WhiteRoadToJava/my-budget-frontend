import React, { useEffect, useState } from "react";
import Row from "../../components/schedule/Row";
import styles from "../../styles/components/schedule/sechedule.module.scss";
import CreateSchedualedIncomse from "./CreateSchedualedIncomse";
import Button from "../../components/btns/Button";
import ToogleMenu from "../../components/elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../api/accountService";
import CreateScheduledExpense from "./CreateSchedualedExpense ";
import SchedualeInfo from "../schedule/SchedualeInfo";
import i18n from "../../configuration/i18n";


const Schedule = ({ schedules }) => {
  const [createSchedualedIncomse, setCreateSchedualedIncomse] = useState(false);
  const [createSchedualedExpense, setCreateSchedualedExpense] = useState(false);
  const [createSchedualedTransfer, setCreateSchedualedTransfer] =
    useState(false);
    const [selectedScheduale, setSelectedScheduale] = useState(null);
  const [scheduleList, setSchedulesList] = useState([]);
  useEffect(() => {
    if (schedules) {
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
    return <div>{i18n.t("errorLoadingAccounts")}: {accountsError.message}</div>;
  }

  const buttonMenuItems = [
    <Button
      key="inc"
      variant="primary"
      text={i18n.t("buttons.createIncomse")}
      onClick={() => setCreateSchedualedIncomse(true)}
    />,
    <Button
      key="exp"
      variant="cancel"
      text={i18n.t("buttons.createExpense")}
      onClick={() => setCreateSchedualedExpense(true)}
    />,
    <Button
      key="tra"
      variant="blue"
      text={i18n.t("buttons.createTransfer")}
      onClick={() => setCreateSchedualedTransfer(true)}
    />,
  ];

   const handleTransactionClick = (scheduale) => {
    setSelectedScheduale(scheduale);
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

      <CreateSchedualedIncomse
        isOpen={createSchedualedIncomse}
        isClose={() => setCreateSchedualedIncomse(false)}
        transactionType="INCOMSE"
        accounts={accounts}
      />

      <CreateScheduledExpense
        isOpen={createSchedualedExpense}
        isClose={() => setCreateSchedualedExpense(false)}
        transactionType="EXPENSE"
        accounts={accounts}
      />

      <SchedualeInfo
        isOpen={!!selectedScheduale}
        onClose={() => setSelectedScheduale(null)}
        scheduale={selectedScheduale || {}}
        accounts={accounts}
      />



      <div className={styles.buttonContainer}>
        <ToogleMenu menuList={buttonMenuItems} position="bottom" />
      </div>
    </div>
  );
};

export default Schedule;
