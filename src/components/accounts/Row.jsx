import React, { useState } from "react";
import styles from "../../styles/components/accounts/row.module.scss";
import { useNavigate } from "react-router-dom";
import ToggleMenu from "../elements/ToggleMenu";
import Button from "../btns/Button";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import SuccessConfirmaton from "../modals/SuccessConfirmaton";
import { deleteAccount } from "../../api/accountService";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAccount from "../account/CreateAccount";
import UpdateAccount from "../account/UpdateAccount";
const Row = ({ account }) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  const [openEditAccount, setOpenEditAccount] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/accounts/${account.id}`);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (accountId) => deleteAccount(accountId),
    onSuccess: () => {
      setOpenDeleteConfirmation(false);
      setSuccessConfirmation(true);

      const timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        setSuccessConfirmation(false);
      }, 4000);

      return () => clearTimeout(timer);
    },
    onError: (err) => {
      console.error("Error deleting account:", err);
      setOpenDeleteConfirmation(false);
      setSuccessConfirmation(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(account.id);
  };

  const menuItems = [
    <Button
      key="edit"
      text="Edit"
      variant="primary"
      type="button"
      onClick={() => setOpenEditAccount(true)}
    />,
    <Button
      key="delete"
      text="delete"
      variant="delete"
      type="button"
      onClick={() => setOpenDeleteConfirmation(true)}
    />,
  ];

  const formatNumber = (number) => {
    const formated = number.toLocaleString("fr-FR");
    return formated;
  };
  return (
    <div className={styles.rowContainer}>
      <div className={styles.rowDetails} onClick={handleClick}>
        <span>{account.name}</span>
        <span
          className={`
    ${styles.totalBalance} 
    ${account.totalBalance >= 0 ? styles.plusValue : styles.minusValue}
  `}
        >
          {formatNumber(account.totalBalance)}
        </span>
        <span>{account.currency}</span>
        <span>{account.type}</span>
      </div>
      <div>
        <ToggleMenu menuList={menuItems} position="top" />
      </div>
      <div>
        <DeleteConfirmation
          isOpen={openDeleteConfirmation}
          onClose={() => setOpenDeleteConfirmation(false)}
          onDelete={handleDelete}
        />
        <SuccessConfirmaton
          isOpen={successConfirmation}
          onClose={() => setSuccessConfirmation(false)}
        />
        <CreateAccount isOpen={false} isClose={() => {}} />
        <UpdateAccount
          isOpen={openEditAccount}
          isClose={() => setOpenEditAccount(false)}
          account={account}
        />
      </div>
    </div>
  );
};

export default Row;
