import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/ecpenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import { addAccount } from "../../api/accountService";
// 1. استيراد React Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateAccount = ({ isOpen, isClose }) => {
  const queryClient = useQueryClient();

  const [accountData, setAccountData] = useState({
    name: "",
    balance: 0,
    currency: "",
    type: "",
  });

  const [error, setError] = useState({ hasError: false, message: "" });

  // 2. إعداد الـ Mutation
  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      // ✅ تحديث قائمة الحسابات فور نجاح الإضافة
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      // تصغير وإغلاق
      setAccountData({ name: "", balance: 0, currency: "", type: "" });
      isClose();
    },
    onError: (err) => {
      setError({
        hasError: true,
        message: "Failed to create account. Please try again."+ err.message,
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
    setError({ hasError: false, message: "" });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    // 3. تنفيذ الـ Mutation بدلاً من الـ API المباشر
    mutation.mutate(accountData);
  };

  const handleValidation = () => {
    if (!accountData.name?.trim()) {
      setError({ hasError: true, message: "Name is required." });
      return false;
    }
    if (!accountData.currency?.trim()) {
      setError({ hasError: true, message: "Currency is required." });
      return false;
    }
    return true;
  };

  return (
    <div className={styles.createExpenseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
          <h2>Create Account</h2>
          <form onSubmit={handleCreateAccount}>
            <div className={styles.inputContainer}>
              <FormInput
                label="Name"
                name="name"
                type="text"
                value={accountData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="Balance"
                name="balance"
                type="number"
                value={accountData.balance}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label="Currency"
                name="currency"
                value={accountData.currency}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <FormInput
                label="Type"
                name="type"
                value={accountData.type}
                onChange={handleInputChange}
              />
            </div>
            <div>
              {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                text={mutation.isPending ? "Creating..." : "Create Account"}
                type="submit"
                disabled={mutation.isPending}
              />
              <Button variant="cancel" text="Cancel" onClick={isClose} type="button" />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateAccount;