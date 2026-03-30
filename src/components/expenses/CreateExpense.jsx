import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/ecpenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import { addExpense } from "../../api/expemseService";

const CreateExpense = ({ isOpen, isClose, account }) => {
  const [expenseData, setExpenseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });
  const [error, setError] = useState({ hasError: false, message: "" });

  const handleCreateExpense = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    if (!handleValidation()) return; // Stop if validation fails;
    // Implement the logic to create an expense using the API
    try {
      // Call the API to create the expense
      const response = await addExpense(expenseData);
      // Handle the response as needed (e.g., show a success message, close the modal, etc.)
      console.log("Expense created successfully:", response);

      isClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating expense:", error);
      // Handle the error as needed (e.g., show an error message)
      setError({
        hasError: true,
        message: "Failed to create expense. Please try again.",
      });
    }
  };
  useEffect(() => {
    const fetchAccount = async () => {
      if (account && account.id) {
        setExpenseData({ ...expenseData, account: { id: account.id } });
      }
    };
    fetchAccount();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };
  const handleValidation = () => {
    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
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
  return (
    <div className={styles.createExpenseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
        <h2>Create Expense</h2>
        <form>
          <div className={styles.inputContainer}>
            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={expenseData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <FormInput
              label="Category"
              name="category"
              value={expenseData.category}
              onChange={handleInputChange}
            />
          </div>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text="Create Expense"
              type="submit"
              onClick={handleCreateExpense}
            />
            <Button variant="cancel" text="Cancel" onClick={isClose} />
          </div>
        </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateExpense;
