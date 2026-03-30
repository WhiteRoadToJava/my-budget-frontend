import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/incomes/createIncomse.module.scss";
import Button from "../../components/btns/Button";
import { addIncomse } from "../../api/incomseService";

const CreateIncomse = ({ isOpen, isClose, account }) => {
  const [incomseData, setIncomseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });
  const [error, setError] = useState({ hasError: false, message: "" });

  const handleCreateIncomse = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    if (!handleValidation()) return; // Stop if validation fails;
    // Implement the logic to create an incomse using the API
    try {
      // Call the API to create the incomse
      const response = await addIncomse(incomseData);
      // Handle the response as needed (e.g., show a success message, close the modal, etc.)
      console.log("Incomse created successfully:", response);

      isClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating incomse:", error);
      // Handle the error as needed (e.g., show an error message)
      setError({
        hasError: true,
        message: "Failed to create incomse. Please try again.",
      });
    }
  };
  useEffect(() => {
    const fetchAccount = async () => {
      if (account && account.id) {
        setIncomseData({ ...incomseData, account: { id: account.id } });
      }
    };
    fetchAccount();
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomseData({ ...incomseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };
  const handleValidation = () => {
    if (!incomseData.amount || parseFloat(incomseData.amount) <= 0) {
      setError({
        hasError: true,
        message: "Amount must be greater than zero.",
      });
      return false;
    }
    if (!incomseData.category) {
      setError({ hasError: true, message: "Category is required." });
      return false;
    }
    return true;
  };
  return (
    <div className={styles.createIncomseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
        <h2>Create Incomse</h2>
        <form>
          <div className={styles.inputContainer}>
            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={incomseData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <FormInput
              label="CCategory"
              name="category"
              value={incomseData.category}
              onChange={handleInputChange}
            />
          </div>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text="Create Incomse"
              type="submit"
              onClick={handleCreateIncomse}
            />
            <Button variant="cancel" text="Cancel" onClick={isClose} />
          </div>
        </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateIncomse;
