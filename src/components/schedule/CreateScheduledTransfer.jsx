import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import styles from "../../styles/components/schedule/createdScheduledTransfer.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "../../api/scheduleService";
import Datepicker from "../inputs/Datepicker";
import i18n from "../../configuration/i18n";

const interval = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

const CreateScheduledTransfer = ({ isOpen, isClose, accounts }) => {
  const [transferData, setTransferData] = useState({
    name: "",
    description: "",
    sourceAccountId: "",
    destinationAccountId: "",
    transactionTypes: ["TRANSFER"],
    category: "transfer",
    amountSend: 0,
    nextExecutionDate: "",
    scheduleIntervals: [],
    isActive: true,
  });
  const [error, setError] = useState({ hasError: false, message: "" });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      cleanData();
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("message.amountless"),
      });
    },
  });

  const accountsList = accounts?.accounts || [];

  const getAccountNameById = (id) => accountsList.find((acc) => acc.id === id)?.name;
  const selectedSourceName = getAccountNameById(transferData.sourceAccountId);
  const selectedDestinationName = getAccountNameById(transferData.destinationAccountId);

  // الحساب المصدر ما لازم يبين بقائمة الحساب الوجهة والعكس، عشان
  // ما يقدر المستخدم يحدد نفس الحساب مصدر ووجهة بنفس الوقت
  const filteredSourceList = accountsList
    .filter((acc) => acc.name !== selectedDestinationName)
    .map((acc) => acc.name);
  const filteredDestinationList = accountsList
    .filter((acc) => acc.name !== selectedSourceName)
    .map((acc) => acc.name);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
    setError({ hasError: false, message: "" });
  };

  const handleAccountChange = (field) => (e) => {
    const selectedName = e.target.value;
    const selectedAccount = accountsList.find((acc) => acc.name === selectedName);
    setTransferData((prev) => ({ ...prev, [field]: selectedAccount?.id || "" }));
    setError({ hasError: false, message: "" });
  };

  const handleValidation = () => {
    if (!transferData.amountSend || parseFloat(transferData.amountSend) <= 0) {
      setError({ hasError: true, message: i18n.t("message.amountless") });
      return false;
    }
    if (!transferData.sourceAccountId || !transferData.destinationAccountId) {
      setError({ hasError: true, message: i18n.t("message.accountRequired") });
      return false;
    }
    return true;
  };

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    mutation.mutate(transferData);
  };

  const cleanData = () => {
    isClose();
    setError({ hasError: false, message: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={cleanData} className={styles.formContainer}>
      <h2 className={styles.title}>{i18n.t("buttons.createTransfer")}</h2>
      <form onSubmit={handleCreateTransfer}>
        <div className={styles.inputContainer}>
          <FormInput
            label={i18n.t("createSchedule.name")}
            name="name"
            type="text"
            value={transferData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.sourceAccount")}
            placeholder={i18n.t("placeholder.sourceAccount")}
            list={filteredSourceList}
            name="sourceAccountId"
            value={selectedSourceName || ""}
            onChange={handleAccountChange("sourceAccountId")}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.destinationAccount")}
            placeholder={i18n.t("placeholder.destinationAccount")}
            list={filteredDestinationList}
            name="destinationAccountId"
            value={selectedDestinationName || ""}
            onChange={handleAccountChange("destinationAccountId")}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.interval")}
            placeholder={i18n.t("placeholder.interval")}
            list={interval}
            name="scheduleIntervals"
            value={transferData.scheduleIntervals || ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setTransferData((prev) => ({ ...prev, scheduleIntervals: [selectedValue] }));
              setError({ hasError: false, message: "" });
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <FormInput
            label={i18n.t("createSchedule.amount")}
            name="amountSend"
            type="number"
            value={transferData.amountSend}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <Datepicker
            label={i18n.t("createSchedule.nextExecutionDate")}
            name="nextExecutionDate"
            value={transferData.nextExecutionDate}
            onChange={(date) => {
              const localDateTime = `${date}T00:00:00.000Z`;
              setTransferData((prev) => ({ ...prev, nextExecutionDate: localDateTime }));
              setError({ hasError: false, message: "" });
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <FormInput
            label={i18n.t("createSchedule.description")}
            name="description"
            type="textarea"
            value={transferData.description}
            onChange={handleInputChange}
          />
        </div>

        {error.hasError && <p className={styles.errorMessage} role="alert">{error.message}</p>}

        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.createTransfer")}
            type="submit"
            disabled={mutation.isPending}
          />
          <Button
            variant="cancel"
            text={i18n.t("buttons.cancel")}
            onClick={cleanData}
            type="button"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateScheduledTransfer;
