import React, { useEffect, useState } from "react";
import Row from "./Row";
import styles from "../../styles/components/accounts/accounts.module.scss";
import AccountsInfo from "./AccountsInfo";

const AccountComponent = ({ accounts }) => {
  const [accountsList, setAccountsList] = useState([]);

  useEffect(() => {
    const fetchAccounts = () => {
      if (accounts) {
        const accountsData = accounts.accounts;
        setAccountsList(accountsData);
      } // Assuming accounts is already passed as a prop, we can directly use it
    };
    fetchAccounts();
  }, [accounts]);
  // Assuming fetchAccounts is a function that retrieves accounts data
  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>Accounts</h2>
      <AccountsInfo accounts={accounts} />
      <div>
        {accountsList.map((account) => (
          <Row key={account.id} account={account} />
        ))}
      </div>

     
    </div>
  );
};

export default AccountComponent;
