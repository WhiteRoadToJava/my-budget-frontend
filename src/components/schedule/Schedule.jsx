import React, { useEffect, useState } from "react";
import Row from "../../components/schedule/Row";
import styles from "../../styles/components/schedule/sechedule.module.scss";
import CreateSchedualedIncomse from "./CreateSchedualedIncomse";
import Button from "../../components/btns/Button";
import ToogleMenu from "../../components/elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../api/accountService";
const Schedule = ({ schedules }) => {
  const [createSchedualedIncomse, setCreateSchedualedIncomse] = useState(false);
  const [createSchedualedExpense, setCreateSchedualedExpense] = useState(false);
  const [createSchedualedTransfer, setCreateSchedualedTransfer] =
    useState(false);
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
    return <div>Loading accounts...</div>;
  }
  if (isAccountsError) {
    return <div>Error loading accounts: {accountsError.message}</div>;
  }

  const buttonMenuItems = [
    <Button
      key="inc"
      variant="primary"
      text="Create Income"
      onClick={() => setCreateSchedualedIncomse(true)}
    />,
    <Button
      key="exp"
      variant="cancel"
      text="Create Expense"
      onClick={() => setCreateSchedualedExpense(true)}
    />,
    <Button
      key="tra"
      variant="blue"
      text="Create Transfer"
      onClick={() => setCreateSchedualedTransfer(true)}
    />,
  ];

  return (
    <div className={styles.scheduleContainer}>
      <div>
        {scheduleList.map((schedule) => (
          <Row key={schedule.id} schedule={schedule} />
        ))}
      </div>

      <CreateSchedualedIncomse
        isOpen={createSchedualedIncomse}
        isClose={() => setCreateSchedualedIncomse(false)}
        transactionType="INCOMSE"
        accounts={accounts}
      />

      <div className={styles.buttonContainer}>
        <ToogleMenu menuList={buttonMenuItems} position="bottom" />
      </div>
    </div>
  );
};

export default Schedule;
