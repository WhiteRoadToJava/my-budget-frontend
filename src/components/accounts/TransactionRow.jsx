import React, { useMemo } from "react";
import { format } from "date-fns";
import styles from "../../styles/components/accounts/transactionRow.module.scss";
import { formatNumber } from "../../utils/formating";
import { findCategory } from "../../assiets/categories/assits";
import transferIcon from "../../assiets/categories/icons/currency.svg";
import { categoryName, typeLabelKey } from "../../utils/transactionTypes";
import { isIncoming, otherAccountName } from "../../utils/transactions/transactionList";
import { dateFnsLocale } from "../../utils/dates";
import { onEnterOrSpace } from "../../utils/accessibility";
import i18n from "../../configuration/i18n";

// One transaction: what it was (category or other account), where and when,
// and the amount with the sign of its effect on the account.
// showAccount: also name the account (lists that mix several accounts).
const Row = ({ transaction, onClick, showAccount = false }) => {
  const category = useMemo(
    () => findCategory(transaction.category, transaction.type),
    [transaction.category, transaction.type],
  );
  const incoming = isIncoming(transaction);
  const other = otherAccountName(transaction);
  const isTransfer = transaction.type === "in-transfer" || transaction.type === "out-transfer";
  const typeKey = typeLabelKey(transaction.type);

  const title = isTransfer
    ? i18n.t(incoming ? "transactionsPage.fromAccount" : "transactionsPage.toAccount", {
        name: other || i18n.t("account.accountdeleted"),
      })
    : categoryName(category) || (typeKey ? i18n.t(typeKey) : transaction.type);

  const accountName = showAccount ? transaction.sourceAccount?.name : null;
  const currency = transaction.sourceAccount?.currency ?? "";
  const date = new Date(transaction.createdAt);
  const validDate = !Number.isNaN(date.getTime());

  return (
    <div
      className={styles.row}
      data-type={transaction.type}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onEnterOrSpace(onClick)}
    >
      <span className={styles.icon} aria-hidden="true">
        <img src={isTransfer ? transferIcon : category?.icon || transferIcon} alt="" />
      </span>

      <span className={styles.main}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>
          {accountName && <span>{accountName}</span>}
          {typeKey && !isTransfer && transaction.type.startsWith("debt") && (
            <span>{i18n.t(typeKey)}</span>
          )}
          {transaction.description && <span className={styles.description}>{transaction.description}</span>}
        </span>
      </span>

      <span className={styles.side}>
        <span className={styles.amount} data-direction={incoming ? "in" : "out"}>
          {incoming ? "+" : "−"}
          {formatNumber(Math.abs(Number(transaction.amount ?? 0)))}
          {currency && <span className={styles.currency}>{currency}</span>}
        </span>
        {validDate && (
          <span className={styles.date}>
            {format(date, "d MMM", { locale: dateFnsLocale(i18n.language) })}
          </span>
        )}
      </span>
    </div>
  );
};

export default Row;
