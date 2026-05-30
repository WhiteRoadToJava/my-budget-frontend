import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import DropDown from "../../components/elements/DropDown";
import Button from "../../components/btns/Button";
import styles from "../../styles/components/schedule/createdSchedualedIncomse.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "../../api/scheduleService";
import Datepicker from "../../components/inputs/Datepicker";
import i18n from "../../configuration/i18n";

const interval = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY"
]

const CreateScheduledIncome = ({
  isOpen,
  isClose,
  transactionType,
  accounts,
}) => {
  const [incomeData, setIncomeData] = useState({
    name: "",
    description: "",
    sourceAccountId:"",
    transactionTypes: [transactionType],
    category: "",
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
        message: i18n.t("errorCreateIncomse"),
      });
    },
  });

  // Fix 1: accountsList declared BEFORE it is used
  const accountsList = accounts?.accounts || [];

  // Fix 2: Now safe to use accountsList here
  const filteredSourceList = accountsList.map((acc) => acc.name);

  const getAccountNameById = (id) =>{
    return accountsList.find((acc) => acc.id === id)?.name;
  }



  // Fix 3: Use correct state field 'sourceAccountId'
  const selectedSourceName = getAccountNameById(incomeData.sourceAccountId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomeData((prev) => ({ ...prev, [name]: value }));
    setError({ hasError: false, message: "" });
  };

  const handleSourceAccountChange = (e) => {
    const selectedName = e.target.value;
    const selectedAccount = accountsList.find(
      (acc) => acc.name === selectedName,
    );
    setIncomeData((prev) => ({
      ...prev,
      sourceAccountId:  selectedAccount?.id || "" ,
    }));
    setError({ hasError: false, message: "" });
  };

  const handleValidation = () => {
    // Fix 4: Validate against correct field 'amountSend'
    if (!incomeData.amountSend || parseFloat(incomeData.amountSend) <= 0) {
      setError({
        hasError: true,
        message: i18n.t("errorCreateIncomse"),
      });
      return false;
    }
    if (!incomeData.category) {
      setError({ hasError: true, message: i18n.t("categoryRequired") });
      return false;
    }
    return true;
  };

  const handleCreateIncome = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    mutation.mutate(incomeData);
  };

  // Fix 5: cleanData now correctly calls isClose()
  const cleanData = () => {
    isClose();
    setError({ hasError: false, message: "" });
  };

 


  return (
    <Modal isOpen={isOpen}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create schedualed Income</h2>
        <form onSubmit={handleCreateIncome}>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("CreateScheduledIncome.name")}
              name="name"
              type="text"
              value={incomeData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <DropDown
              label={i18n.t("CreateScheduledIncome.sourceAccount")}
              placeholder={i18n.t("placeholder.sourceAccount")}
              list={filteredSourceList}
              name="sourceAccountId"
              value={selectedSourceName || ""}
              onChange={handleSourceAccountChange}
            />
          </div>

                    <div>
            <DropDown
              label={i18n.t("CreateScheduledIncome.interval")}
              placeholder={i18n.t("placeholder.interval")}
              list={interval}
              name="scheduleIntervals"
              value={incomeData.scheduleIntervals || ""}
              onChange={(e) =>{
                const selectedValue = e.target.value;
                setIncomeData((prev) => ({
                  ...prev,
                  scheduleIntervals: [selectedValue],
                }));
                setError({ hasError: false, message: "" }); 
              }}
            />
          </div>

          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("CreateScheduledIncome.amountSend")}
              name="amountSend"
              type="number"
              value={incomeData.amountSend}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <Datepicker
              label={i18n.t("CreateScheduledIncome.nextExecutionDate")}
              name="nextExecutionDate"
              value={incomeData.nextExecutionDate}
              onChange={(date) => {
                const localDateTime = `${date}T00:00:00.000Z`
                setIncomeData((prev) => ({
                  ...prev,
                  nextExecutionDate: localDateTime,
                }));
                setError({ hasError: false, message: "" });
              }}
            />
          </div>
          
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("CreateScheduledIncome.category")}
              name="category"
              type="text"
              value={incomeData.category}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("CreateScheduledIncome.description")}
              name="description"
              type="textarea"
              value={incomeData.description}
              onChange={handleInputChange}
            />
          </div>

          {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={mutation.isPending ? "Saving..." : "Create Income"}
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

export default CreateScheduledIncome;
