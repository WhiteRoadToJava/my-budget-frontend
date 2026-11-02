import React from "react";
import { parseISO } from "date-fns";
import styles from "../../styles/components/debts/debtDetails.module.scss";
import { formatNumber } from "../../utils/formating";
import i18n from "../../configuration/i18n";

// movements come from the backend oldest first; the newest is shown on top
const DebtMovementsTable = ({ movements, currency, onDelete, deletingId }) => {
  if (!movements || movements.length === 0) {
    return <p className={styles.empty}>{i18n.t("debts.noMovements")}</p>;
  }
  const rows = [...movements].reverse();

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{i18n.t("debts.date")}</th>
            <th scope="col">{i18n.t("debts.type")}</th>
            <th scope="col" className={styles.number}>{i18n.t("debts.amount")}</th>
            <th scope="col">{i18n.t("debts.account")}</th>
            <th scope="col" className={styles.number}>{i18n.t("debts.interestPart")}</th>
            <th scope="col" className={styles.number}>{i18n.t("debts.principalPart")}</th>
            <th scope="col">{i18n.t("debts.description")}</th>
            <th scope="col"><span className={styles.visuallyHidden}>{i18n.t("buttons.delete")}</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => {
            const isIn = m.cashFlow === "IN";
            return (
              <tr key={m.id}>
                <td>{parseISO(m.date).toLocaleDateString()}</td>
                <td>
                  {m.movementType === "DISBURSEMENT"
                    ? i18n.t("debts.disbursement")
                    : i18n.t("debts.repayment")}
                  {m.countedAsTransaction && (
                    <span className={styles.label}> · {i18n.t("debts.recorded")}</span>
                  )}
                </td>
                <td className={`${styles.number} ${isIn ? styles.in : styles.out}`}>
                  {isIn ? "+" : "−"}
                  {formatNumber(m.amount)} {currency}
                </td>
                <td>{m.accountName || i18n.t("account.accountdeleted")}</td>
                <td className={styles.number}>
                  {m.movementType === "REPAYMENT" ? formatNumber(m.interestPart ?? 0) : "—"}
                </td>
                <td className={styles.number}>
                  {m.movementType === "REPAYMENT" ? formatNumber(m.principalPart ?? 0) : "—"}
                </td>
                <td className={styles.description}>{m.description || ""}</td>
                <td>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onDelete(m)}
                    disabled={deletingId === m.id}
                    aria-label={i18n.t("debts.deleteMovement")}
                  >
                    {i18n.t("buttons.delete")}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DebtMovementsTable;
