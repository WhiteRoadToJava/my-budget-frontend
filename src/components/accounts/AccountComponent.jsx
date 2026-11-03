import React, { useMemo, useState } from "react";
import Row from "./AccountRow";
import styles from "../../styles/components/accounts/accountsList.module.scss";
import Button from "../btns/Button";
import PlusIcon from "../icons/btns/PlusIcon";
import CreateAccount from "./CreateAccount";
import SearchInput from "../inputs/SearchInput";
import { formatNumber } from "../../utils/formating";
import { searchAccounts, splitAccounts, totalsByCurrency } from "../../utils/accounts/accountList";
import i18n from "../../configuration/i18n";

const AccountComponent = ({ accounts }) => {
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [tab, setTab] = useState("active");
  const [query, setQuery] = useState("");

  // derived from the data: no copies in state that can drift
  const { active, archived } = useMemo(() => splitAccounts(accounts?.accounts), [accounts]);
  const totals = useMemo(() => totalsByCurrency(active), [active]);
  const visible = searchAccounts(tab === "active" ? active : archived, query);

  const emptyText =
    query.trim()
      ? i18n.t("accountsPage.noMatch", { query: query.trim() })
      : tab === "active"
        ? i18n.t("accountsPage.empty")
        : i18n.t("accountsPage.archivedEmpty");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>{i18n.t("accountsPage.title")}</h2>
        <Button
          text={i18n.t("accountsPage.buttonText")}
          type="button"
          variant="primary"
          Icon={PlusIcon}
          onClick={() => setOpenCreateAccount(true)}
        />
      </div>

      {totals.length > 0 && (
        <section className={styles.balances} aria-label={i18n.t("accountInfo.totaBalance")}>
          {totals.map((t) => (
            <p key={t.currency} className={styles.balance}>
              <span className={`${styles.balanceAmount} ${t.total < 0 ? styles.negative : ""}`}>
                {formatNumber(t.total)}
              </span>
              <span className={styles.balanceCurrency}>{t.currency}</span>
            </p>
          ))}
          <p className={styles.count}>
            {i18n.t("accountsPage.activeCount", { count: active.length })}
          </p>
        </section>
      )}

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={i18n.t("accountsPage.searchInput")}
            aria-label={i18n.t("accountsPage.searchInput")}
          />
        </div>
        <div className={styles.tabs} role="tablist">
          <button type="button" role="tab" className={styles.tab}
            aria-selected={tab === "active"} onClick={() => setTab("active")}>
            {i18n.t("accountsPage.activeTab", { count: active.length })}
          </button>
          <button type="button" role="tab" className={styles.tab}
            aria-selected={tab === "archived"} onClick={() => setTab("archived")}>
            {i18n.t("accountsPage.archivedTab", { count: archived.length })}
          </button>
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className={styles.list}>
          {visible.map((account) => (
            <Row key={account.id} account={account} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{emptyText}</p>
      )}

      <CreateAccount isOpen={openCreateAccount} isClose={() => setOpenCreateAccount(false)} />
    </div>
  );
};

export default AccountComponent;
