import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import styles from "../../styles/components/schedule/createdSchedualedExpense.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "../../api/scheduleService";
import Datepicker from "../inputs/Datepicker";


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
        message: "Failed to create income. Please try again.",
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
        message: "Amount must be greater than zero.",
      });
      return false;
    }
    if (!expenseData.category) {
      setError({ hasError: true, message: "Category is required." });
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
              label="Name"
              name="name"
              type="text"
              value={expenseData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <DropDown
              label="Source Account"
              placeholder="Select a source account"
              list={filteredSourceList}
              name="sourceAccountId"
              value={selectedSourceName || ""}
              onChange={handleSourceAccountChange}
            />
          </div>

                    <div>
            <DropDown
              label="Schedule Interval"
              placeholder="Select a schedule interval"
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
              label="Amount"
              name="amountSend"
              type="number"
              value={expenseData.amountSend}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <Datepicker
              label="Next Execution Date"
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
              label="Category"
              name="category"
              type="text"
              value={expenseData.category}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <FormInput
              label="Description"
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
              text={mutation.isPending ? "Saving..." : "Create Income"}
              type="submit"
              disabled={mutation.isPending}
            />
            {/* Fix 8: Cancel now calls cleanData to also reset errors */}
            <Button
              variant="cancel"
              text="Cancel"
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
