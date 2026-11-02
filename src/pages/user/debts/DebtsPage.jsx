import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDebts } from "../../../api/debtService";
import i18n from "../../../configuration/i18n";
import styles from "../../../styles/components/debts/debts.module.scss";
import DebtsSummary from "../../../components/debts/DebtsSummary";
import DebtCard from "../../../components/debts/DebtCard";
import { filterDebts, sortDebts, summarizeDebts } from "../../../utils/debts/summarizeDebts";

const FILTERS = [
  { value: "ALL", label: "debts.all" },
  { value: "OWED_BY_ME", label: "debts.owedByMe" },
  { value: "OWED_TO_ME", label: "debts.owedToMe" },
];

const DebtsPage = () => {
  const [filter, setFilter] = useState("ALL");
  const { data: debts = [], isLoading, isError } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  // the summary always covers all debts; the filter only changes the cards
  const totals = useMemo(() => summarizeDebts(debts), [debts]);
  const visible = useMemo(() => sortDebts(filterDebts(debts, filter)), [debts, filter]);

  if (isLoading) return <div className={styles.page}>{i18n.t("debts.loading")}</div>;
  if (isError) return <div className={styles.page}>{i18n.t("debts.loadError")}</div>;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("debts.title")}</h2>

      {debts.length === 0 ? (
        <p className={styles.empty}>{i18n.t("debts.empty")}</p>
      ) : (
        <>
          <DebtsSummary totals={totals} />

          <div className={styles.filters} role="group" aria-label={i18n.t("debts.direction")}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={styles.filterButton}
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {i18n.t(f.label)}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className={styles.empty}>{i18n.t("debts.noMatch")}</p>
          ) : (
            <div className={styles.cardGrid}>
              {visible.map((debt) => (
                <DebtCard key={debt.id} debt={debt} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DebtsPage;
