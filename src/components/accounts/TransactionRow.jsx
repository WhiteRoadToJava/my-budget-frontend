import React, { useMemo } from "react";
import styles from "../../styles/components/accounts/transactionRow.module.scss";
import { formatNumber } from "../../utils/formating";
import { findCategory } from "../../assiets/categories/assits";
import { categoryName, typeLabelKey } from "../../utils/transactionTypes";
import { onEnterOrSpace } from "../../utils/accessibility";
import i18n from "../../configuration/i18n";

const Row = ({ transaction, onClick }) => {
  // derived from the transaction; findCategory also knows "Debt" and debt-in / debt-out
  const category = useMemo(
    () => findCategory(transaction.category, transaction.type),
    [transaction.category, transaction.type],
  );
  const typeKey = typeLabelKey(transaction.type);

  return (
    <div
      className={styles.rowContainer}
      data-type={transaction.type}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onEnterOrSpace(onClick)}
    >
      <p>{formatNumber(transaction.amount)}</p>
      <p>{categoryName(category)}</p>
      <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
      <p className={styles.transactionType} data-type={transaction.type}>
        {typeKey ? i18n.t(typeKey) : transaction.type}
      </p>
    </div>
  );
};

export default Row;
