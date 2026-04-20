import React, { useEffect, useState } from "react";
import Row from "./Row";
import styles from "../../styles/components/accounts/accounts.module.scss";
import AccountsInfo from "./AccountsInfo";
import PlusButton from "../btns/PlusButton";
import CreateAccount from "../account/CreateAccount";
import SearchInput from "../inputs/SearchInput";

const AccountComponent = ({ accounts }) => {
  const [accountsList, setAccountsList] = useState([]);
  const [openCreateAccount, setOpenCreateAccount] = useState(false);

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

  const handleOnSearch = (value) => {
    const filteredAccounts = accounts.accounts.filter((account) =>
      account.name.toLowerCase().includes(value.toLowerCase())
    );
    setAccountsList(filteredAccounts);
  };



  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>Accounts</h2>
      <AccountsInfo accounts={accounts} />
      <div className={styles.divider}></div>
      <div className={styles.accountHeader}>
        <PlusButton
          text="Create Account"
          type="button"
          onClick={() => setOpenCreateAccount(true)}
        />
        <SearchInput
          onChange={(e) => handleOnSearch(e.target.value)}
        />
      </div>
      <div className={styles.accountBody}>
        {accountsList.map((account) => (
          <Row key={account.id} account={account} />
        ))}
      </div>






      <div className={styles.accountSearch}>
        <CreateAccount
          isOpen={openCreateAccount}
          isClose={() => setOpenCreateAccount(false)}
        />
      </div>
    </div>
  );
};

export default AccountComponent;

// Example menu items, you can customize this as needed
