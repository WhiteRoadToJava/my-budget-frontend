import React, { use, useState }from "react";
import styles from "../../../styles/incomses/incomses.module.scss";
import Row from "../../../components/account/Row";
import { useQuery } from "@tanstack/react-query";
import TransactionInfo from "../../../components/transactions/TransactionInfo"
import {
  getAccounts,
  getAllIncomseAndExpensesTransactions,
} from "../../../api/accountService";
import { useNavigate } from "react-router-dom";

const Incomse = () => {
  const navigate = useNavigate();
const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const {
    data: data = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    error: accountsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllIncomseAndExpensesTransactions(),
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
  const { data: accountsData = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });
  if (isAccountsLoading) {
    return <div>Loading accounts...</div>;
  }
  if (isAccountsError) {
    return <div>Error loading accounts: {accountsError.message}</div>;
  }
  const handleIncomseClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };
  const handleAccountClick = (account) => {
    navigate(`/user/accounts/${account.id}`);
  };



  console.log(data);
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <h1>Incomse</h1>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={styles.incomsesContainer}>
          {data.map(
            (transaction) =>
              transaction.type === "incomse" && (
                <div className={styles.rowsCountainer} key={transaction.id}>
                  <Row key={transaction.id} transaction={transaction}
                  onClick={
                    () => handleIncomseClick(transaction)
                  }/>
                </div>
              ),
          )}
        </div>
        <div className={styles.accountsContainer}>
          <h2 className={styles.accountsTitle}>Accounts</h2>
          <div className={styles.accounts}>
            {accountsData.accounts.map((account) => (
              <div className={styles.account} key={account.id}>
                <p>{account.name}</p>
                <div className={styles.totalBalance}
                onClick={() => handleAccountClick(account)}>
                  TotalBalance:{" "}
                  <p
                    className={styles.totalBalanceValue}
                    data-type={
                      account.totalBalance > 0 ? "positive" : "negative"
                    }
                  >
                    {account.totalBalance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedTransaction && (
        <TransactionInfo
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          transaction={selectedTransaction}
          accounts={accountsData.accounts}
          transactions={data}
        />
      )}
    </div>
  );
};

export default Incomse;
