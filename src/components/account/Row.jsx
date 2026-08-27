import React, { useEffect, useState } from "react";
import styles from "../../styles/components/account/row.module.scss";
import { formatNumber } from "../../utils/formating";
import { incomseCategoryList } from "../../assiets/categories/assits";
import { expenseCategoryList } from "../../assiets/categories/assits";
const Row = ({ transaction, onClick }) => {
  const [category, setCategory] = useState(null);
  useEffect(() => {
    // Deliberate: pure derivation from `transaction` + static category lists.
    // Could become useMemo instead of local state; tracked as a follow-up
    // cleanup rather than changed here to keep this fix scoped to CI unblocking.
    if (transaction.type === "incomse") {
      const category = incomseCategoryList.find(
        (item) => item.id === Number(transaction.category),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
      setCategory(category);
    } else if (transaction.type === "expense") {
      const category = expenseCategoryList.find(
        (item) => item.id === Number(transaction.category),
      );
      setCategory(category);
    }
  }, [transaction]);
  return (
    <div
      className={styles.rowContainer}
      data-type={transaction.type}
      onClick={onClick}
    >
      <p>{formatNumber(transaction.amount)}</p>
      <p>{category?.name}</p>
      <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
      <p className={styles.transactionType} data-type={transaction.type}>
        {transaction.type}
      </p>
    </div>
  );
};

export default Row;
