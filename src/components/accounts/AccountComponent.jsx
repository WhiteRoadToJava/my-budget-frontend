import React, { useEffect, useState } from "react";
import Row from "./AccountRow";
import styles from "../../styles/components/accounts/accounts.module.scss";
import AccountsInfo from "./AccountsInfo";
import Button from "../btns/Button";
import PlusIcon from "../icons/btns/PlusIcon";
import CreateAccount from "./CreateAccount";
import SearchInput from "../inputs/SearchInput";
import i18n from "../../configuration/i18n";
import { ar } from "date-fns/locale";

const AccountComponent = ({ accounts }) => {
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [activeAccounts, setActiveAccounts] = useState([]);
  const [archivedAccounts, setArchivedAccounts] = useState([]);
  const [showArchivedAccounts, setShowArchivedAccounts] = useState(false);

  useEffect(() => {
    const fetchAccounts = () => {
      if (accounts) {
        const accountsData = accounts.accounts;
        setActiveAccounts(
          accountsData.filter((account) => account.status[0] === "ACTIVE"),
        );
        setArchivedAccounts(
          accountsData.filter((account) => account.status[0] === "ARCHIVED"),
        );
      }
    };
    fetchAccounts();
  }, [accounts]);
  // Assuming fetchAccounts is a function that retrieves accounts data

  const handleOnSearch = (value) => {
    const filteredAccounts = accounts?.accounts?.filter((account) =>
      account.name.toLowerCase().includes(value.toLowerCase()),
    );
    setActiveAccounts(filteredAccounts || []);
  };

  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>Accounts</h2>
      <AccountsInfo accounts={accounts} />
      <div className={styles.divider}></div>
      <div className={styles.accountHeader}>
        <div>
          <Button
            text={i18n.t("accountsPage.buttonText")}
            type="button"
            variant="primary"
            Icon={PlusIcon}
            onClick={() => setOpenCreateAccount(true)}
          />
        </div>
        <div>
          <SearchInput
            onChange={(e) => handleOnSearch(e.target.value)}
            placeholder={i18n.t("accountsPage.searchInput")}
          />
        </div>
      </div>
      <div className={styles.rowtitle}>
        <p className={styles.headerItem}>{i18n.t("accounts.name")}</p>
        <p className={styles.headerItem}>{i18n.t("accounts.amount")}</p>
        <p className={styles.headerItem}>{i18n.t("accounts.currency")}</p>
        <p className={styles.headerItem}>{i18n.t("accounts.type")}</p>
        <p className={styles.headerItem}>{i18n.t("accounts.actions")}</p>
      </div>
      <div className={styles.accountBody}>
        {activeAccounts.map((account) => (
          <Row key={account.id} account={account} />
        ))}
      </div>

      <div className={styles.accountSearch}>
        <CreateAccount
          isOpen={openCreateAccount}
          isClose={() => setOpenCreateAccount(false)}
        />
      </div>
      <div className={styles.archivedAccountsContainer}>
        <p
          className={styles.archivedAccountsTitle}
          onClick={() => setShowArchivedAccounts(!showArchivedAccounts)}
        >
          {i18n.t("accounts.archivedAccounts")}
        </p>

        {showArchivedAccounts ? (
          <div className={styles.archivedAccounts}>
            {archivedAccounts.length > 0 &&
              archivedAccounts.map((accounts) => (
                <Row key={accounts.id} account={accounts} />
              ))}
          </div>
        ):(
            <div className={styles.divider}></div>
          )}
      </div>
    </div>
  );
};

export default AccountComponent;

// Example menu items, you can customize this as needed
