import React, { useEffect, useState } from 'react'
import styles from '../../styles/components/account/account.module.scss';
import Row from './Row';
import { getAllTransactions } from '../../api/accountService';
const Account = ({account}) => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsData = await getAllTransactions(account);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    if (account) {
      fetchTransactions();
    }
  }, [account]);
console.log(transactions)
  return (
    <div className={styles.accountContainer}>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <Row key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  )
}

export default Account
