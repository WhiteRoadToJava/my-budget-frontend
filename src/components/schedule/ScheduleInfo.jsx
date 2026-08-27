import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/schedule/scheduleInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import UpdateTransfer from "../transfers/UpdateTransfer";
import UpdateIncomse from "../imcomses/UpdateIncomse";
import UpdateExpense from "../expenses/UpdateExpense";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule } from "../../api/scheduleService";
import i18n from "../../configuration/i18n";
import UpdateSchedule from "./UpdateSchedule";

const ScheduleInfo = ({ isOpen, onClose, accounts, schedule }) => {
  const queryClient = useQueryClient();
  const [openUpdateSchedule, setOpenUpdateSchedule] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const accountName = schedule?.sourceAccount?.name;

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

  const handleDelete = async () => {
    deleteSchdule.mutate(schedule.id);
    
  };

  const buttonMenuItems = [
    <Button key="edit" text="Edit" type="button" onClick={()=> setOpenUpdateSchedule(true)} />,
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
            data-type={schedule.transactionType}
          >
            <h2 className={styles.transactionTitleText}>
              {i18n.t("scheduleInfo.title")}
              {" " + schedule.transactionType} Details
            </h2>
          </div>

          <div className={styles.divider}></div>
          <div>
            <ToggleMenu menuList={buttonMenuItems} />
          </div>
          <div className={styles.menuContainer}>
            <ToggleMenu menuList={buttonMenuItems} />
          </div>

          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.name")}:</strong> {schedule.name}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.category")}:</strong> {schedule.category}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.amount")}:</strong>{" "}
            {schedule?.amountSend
              ? Number(schedule.amountSend).toFixed(2)
              : "0.00"}{" "}
            {schedule.currency}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.account")}:</strong> {accountName}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.nextExecutionDate")}:</strong>{" "}
            {new Date(schedule.executionDate).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("scheduleInfo.description")}:</strong> {schedule.description}
          </p>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button text={i18n.t("buttons.close")} variant="cancel" onClick={onClose} />
          </div>
        </div>
      </Modal>
      <UpdateSchedule  sechuleId={schedule.id} schedule={schedule} />



      <DeleteConfimation
        isOpen={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onDelete={handleDelete}
      />

      <UpdateSchedule
        isOpen={openUpdateSchedule}
        isClose={() => setOpenUpdateSchedule(false)}
        schedule={schedule}
        accounts={accounts}
        />

    </>
  );
};

export default ScheduleInfo;
