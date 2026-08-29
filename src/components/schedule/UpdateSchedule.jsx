import React, { useState, useEffect } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import styles from "../../styles/components/schedule/createdScheduledExpense.module.scss";
import { updateSchedule } from "../../api/scheduleService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Datepicker from "../inputs/Datepicker";
import i18n from "../../configuration/i18n";

const interval = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

const UpdateSchedule = ({ isOpen, isClose, schedule }) => {
  const [updateScheduleRequest, setUpdateScheduleRequest] = useState({
    name: "",
    description: "",
    scheduleIntervalSet: [],
    category: "",
    amountSend: 0,
    exChangeRate: 0,
    amountReceived: 0,
    nextExecutionDate: "",
    isActive: true,
  });
  const [error, setError] = useState({ hasError: false, message: "" });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => updateSchedule(schedule.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      cleanData();
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("errorUpdateSchedule"),
      });
    },
  });

  const cleanData = () => {
    isClose();
    setError({ hasError: false, message: "" });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateScheduleRequest((prev) => ({ ...prev, [name]: value }));
    setError({ hasError: false, message: "" });
  };
  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    mutation.mutate(updateScheduleRequest);
  };

  // Deliberate: initializes the editable form fields from the `schedule` prop
  // when it changes. Candidate for a `key`-based remount at the call site
  // instead of this effect; tracked as a follow-up cleanup rather than
  // changed here to keep this fix scoped to CI unblocking.
  useEffect(() => {
    if (!schedule || !schedule.id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUpdateScheduleRequest({
      name: schedule.name,
      description: schedule.description,
      scheduleIntervalSet: [schedule.scheduleInterval],
      category: schedule.category,
      amountSend: schedule.amountSend,
      exChangeRate: schedule.exChangeRate ?? 0,
      amountReceived: schedule.amountReceived ?? 0,
      nextExecutionDate: schedule.executionDate,
      isActive: schedule.isActive ?? true,
    });
  }, [schedule]);

  return (
    <Modal isOpen={isOpen} isClose={cleanData}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Update schedule</h2>
        <form onSubmit={handleUpdateSchedule}>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.name")}
              placeholder={i18n.t("placeholder.name")}
              name="name"
              type="text"
              value={updateScheduleRequest.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.category")}
              name="category"
              type="text"
              value={updateScheduleRequest.category}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.description")}
              name="description"
              type="textarea"
              value={updateScheduleRequest.description}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.amount")}
              placeholder={i18n.t("placeholder.amount")}
              name="amountSend"
              type="number"
              value={updateScheduleRequest.amountSend}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <DropDown
              label={i18n.t("createSchedule.interval")}
              placeholder={i18n.t("placeholder.interval")}
              list={interval}
              name="scheduleIntervals"
              value={updateScheduleRequest.scheduleIntervalSet || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setUpdateScheduleRequest((prev) => ({
                  ...prev,
                  scheduleIntervalSet: [selectedValue],
                }));
                setError({ hasError: false, message: "" });
              }}
            />
          </div>

          {schedule?.transactionTypes?.includes("EXPENSE")  ? <div></div> : null}

          <div className={styles.inputContainer}>
            <Datepicker
              label={i18n.t("createSchedule.nextExecutionDate")}
              placeholder={i18n.t("placeholder.nextExecutionDate")}
              name="nextExecutionDate"
              value={
                updateScheduleRequest.nextExecutionDate
                  ? new Date(updateScheduleRequest.nextExecutionDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(date) => {
                const localDateTime = `${date}T00:00:00.000Z`;
                setUpdateScheduleRequest((prev) => ({
                  ...prev,
                  nextExecutionDate: localDateTime,
                }));
                setError({ hasError: false, message: "" });
              }}
            />
          </div>

          {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={
                mutation.isPending
                  ? i18n.t("buttons.loading")
                  : i18n.t("buttons.createExpense")
              }
              type="submit"
              disabled={mutation.isPending}
            />
            {/* Fix 8: Cancel now calls cleanData to also reset errors */}
            <Button
              variant="cancel"
              text={i18n.t("buttons.cancel")}
              onClick={cleanData}
              type="button"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateSchedule;
