import React, { useState } from "react";
import styles from "../../styles/components/accounts/row.module.scss";
import { useNavigate } from "react-router-dom";
import ToggleMenu from "../elements/ToggleMenu";
import Button from "../btns/Button";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import SuccessConfirmaton from "../modals/SuccessConfirmaton";
import { deleteAccount, updateAccountStatus } from "../../api/accountService";
import { formatNumber } from "../../utils/formating";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAccount from "../account/CreateAccount";
import UpdateAccount from "../account/UpdateAccount";
import i18n from "../../configuration/i18n";
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
  const updateMutation = useMutation({
    mutationFn: ({accountId, status}) => updateAccountStatus(accountId, status),
    onSuccess: () => {
      setOpenDeleteConfirmation(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
      onError:(err) => {
        console.error("Error Update Account Status: " , err)
        setOpenDeleteConfirmation(false);
        setSuccessConfirmation(false);
      }
  });



  const handleDelete = () => {
    deleteMutation.mutate(account.id);
  };

  const updateStatus = async () => {
    const statusValue = account.status[0];
    updateMutation.mutate({
      accountId: account.id,
      status: statusValue === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
    });
    if (account.status === "ACTIVE") {
      console.log(account.status)
    } else {
      console.log(account.status)
    }
    
  }
  const menuItems = [
    <Button
      key={account.id}
      text={i18n.t("buttons.edit")}
      variant="primary"
      type="button"
      onClick={() => setOpenEditAccount(true)}
    />,
    <Button
      key={account.id}
      text={account.status[0] === "ACTIVE" ? i18n.t("buttons.archived") : i18n.t("buttons.active")}
      variant="primary"
      type="button"
      onClick={updateStatus}
    />,
    <Button
      key={account.id}
      text={i18n.t("buttons.delete")}
      variant="delete"
      type="button"
      onClick={() => setOpenDeleteConfirmation(true)}
    />,
  ];

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
