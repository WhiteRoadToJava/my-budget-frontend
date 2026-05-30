import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/schedule/schedualeInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import UpdateTransfer from "../transfers/UpdateTransfer";
import UpdateIncomse from "../imcomses/UpdateIncomse";
import UpdateExpense from "../expenses/UpdateExpense";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "../../api/scheduleService";
import i18n from "../../configuration/i18n";

const SchedualeInfo = ({ isOpen, onClose, accounts, scheduale }) => {
  const queryClient = useQueryClient();
  const [openUpdateTransfer, setOpenUpdateTransfer] = useState(false);
  const [openUpdateIncomse, setOpenUpdateIncomse] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const accountName = scheduale?.sourceAccount?.name;

  const deleteSchdule = useMutation({
      mutationFn: (scheduleId) => deleteSchedule(scheduleId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        onClose();
        setOpenConfirmDelete(false);
      },
      onError: () => {
        setError({
          hasError: true,
          message: i18n.t("errorDeleteSchedule"),
        });
      },
    });

  const handleUpdate = () => {};

  const handleDelete = async () => {
    deleteSchdule.mutate(scheduale.id);
    
  };

  const buttonMenuItems = [
    <Button key="edit" text="Edit" type="button" onClick={handleUpdate} />,
    <Button
      key="delete"
      variant="delete"
      text={i18n.t("buttons.delete")}
      type="button"
      onClick={() => setOpenConfirmDelete(true)}
    />,
    <Button
      key="close"
      variant="cancel"
      text={i18n.t("buttons.close")}
      type="button"
      onClick={onClose}
    />,
  ];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.transactionContainer}>
          <div
            className={styles.transactionTitle}
            data-type={scheduale.transactionType}
          >
            <h2 className={styles.transactionTitleText}>
              {i18n.t("schedualeInfo.title")}
              {" " + scheduale.transactionType} Details
            </h2>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.menuContainer}>
            <ToggleMenu menuList={buttonMenuItems} />
          </div>

          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.name")}:</strong> {scheduale.name}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.category")}:</strong> {scheduale.category}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.amount")}:</strong>{" "}
            {scheduale?.amountSend
              ? Number(scheduale.amountSend).toFixed(2)
              : "0.00"}{" "}
            {scheduale.currency}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.account")}:</strong> {accountName}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.nextExecutionDate")}:</strong>{" "}
            {new Date(scheduale.executionDate).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("schedualeInfo.description")}:</strong> {scheduale.description}
          </p>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button text={i18n.t("buttons.close")} variant="cancel" onClick={onClose} />
          </div>
        </div>
      </Modal>
      {scheduale &&
      (scheduale.type === "in-transfer" ||
        scheduale.type === "out-transfer") ? (
        <UpdateTransfer
          isOpen={openUpdateTransfer}
          isClose={() => {
            setOpenUpdateTransfer(false);
            onClose(false);
          }}
          accounts={accounts}
          transfer={scheduale}
        />
      ) : scheduale.type === "expense" ? (
        <UpdateExpense
          isOpen={updateExpense}
          isClose={() => {
            setOpenUpdateIncomse(false);
            onClose(false);
          }}
          expense={scheduale}
        />
      ) : (
        <UpdateIncomse
          isOpen={openUpdateIncomse}
          isClose={() => {
            setOpenUpdateIncomse(false);
            onClose(false);
          }}
          incomse={scheduale}
        />
      )}
      <DeleteConfimation
        isOpen={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default SchedualeInfo;
