import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import styles from "../../styles/components/schedule/createdSchedualedExpense.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "../../api/scheduleService";
import Datepicker from "../inputs/Datepicker";
import i18n from "../../configuration/i18n";



const interval = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY"
]

const CreateScheduledExpense = ({
  isOpen,
  isClose,
  transactionType,
  accounts,
}) => {
  const [expenseData, setExpenseData] = useState({
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
        message: i18n.t("message.errorCreateExpense"),
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
  const selectedSourceName = getAccountNameById(expenseData.sourceAccountId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
    setError({ hasError: false, message: "" });
  };

  const handleSourceAccountChange = (e) => {
    const selectedName = e.target.value;
    const selectedAccount = accountsList.find(
      (acc) => acc.name === selectedName,
    );
    setExpenseData((prev) => ({
      ...prev,
      sourceAccountId:  selectedAccount?.id || "" ,
    }));
    setError({ hasError: false, message: "" });
  };

  const handleValidation = () => {
    // Fix 4: Validate against correct field 'amountSend'
    if (!expenseData.amountSend || parseFloat(expenseData.amountSend) <= 0) {
      setError({
        hasError: true,
        message: i18n.t("message.amountless"),
      });
      return false;
    }
    if (!expenseData.category) {
      setError({ hasError: true, message: i18n.t("message.categoryRequired") });
      return false;
    }
    return true;
  };

  const handleCreateIncome = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    mutation.mutate(expenseData);
  };

  // Fix 5: cleanData now correctly calls isClose()
  const cleanData = () => {
    isClose();
    setError({ hasError: false, message: "" });
  };

 


  return (
    <Modal isOpen={isOpen}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create Schedualed Expense</h2>
        <form onSubmit={handleCreateIncome}>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.name")}
              name="name"
              type="text"
              value={expenseData.name}
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
              onChange={handleSourceAccountChange}
            />
          </div>

                    <div>
            <DropDown
              label={i18n.t("createSchedule.interval")}
              placeholder={i18n.t("placeholder.interval")}
              list={interval}
              name="scheduleIntervals"
              value={expenseData.scheduleIntervals || ""}
              onChange={(e) =>{
                const selectedValue = e.target.value;
                setExpenseData((prev) => ({
                  ...prev,
                  scheduleIntervals: [selectedValue],
                }));
                setError({ hasError: false, message: "" }); 
              }}
            />
          </div>

          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.amount")}
              name="amountSend"
              type="number"
              value={expenseData.amountSend}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <Datepicker
              label={i18n.t("createSchedule.nextExecutionDate")}
              name="nextExecutionDate"
              value={expenseData.nextExecutionDate}
              onChange={(date) => {
                const localDateTime = `${date}T00:00:00.000Z`
                setExpenseData((prev) => ({
                  ...prev,
                  nextExecutionDate: localDateTime,
                }));
                setError({ hasError: false, message: "" });
              }}
            />
          </div>
          
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.category")}
              name="category"
              type="text"
              value={expenseData.category}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createSchedule.description")}
              name="description"
              type="textarea"
              value={expenseData.description}
              onChange={handleInputChange}
            />
          </div>

          {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.createExpense")}
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

export default CreateScheduledExpense;
