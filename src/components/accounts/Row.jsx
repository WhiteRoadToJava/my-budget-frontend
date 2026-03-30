import React from "react";
import styles from "../../styles/components/accounts/row.module.scss";
import { useNavigate } from "react-router-dom";
const Row = ({ account }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/accounts/${account.id}`);
  };

  return (
    <div className={styles.rowContainer}
    onClick={handleClick}>
      <span>{account.name}</span>
      <span
        className={`
    ${styles.totalBalance} 
    ${account.totalBalance >= 0 ? styles.plusValue : styles.minusValue}
  `}
      >
        {account.totalBalance}
      </span>
      <span>{account.currency}</span>
      <span>{account.type}</span>
    </div>
  );
};

export default Row;
