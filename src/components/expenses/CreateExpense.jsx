import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/ecpenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import { addExpense } from "../../api/expemseService";
// 1. استيراد React Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateExpense = ({ isOpen, isClose, account }) => {
  const queryClient = useQueryClient();

  const [expenseData, setExpenseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });

  const [error, setError] = useState({ hasError: false, message: "" });

  // 2. إعداد الـ Mutation لإضافة المصروف
  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      // ✅ تحديث قائمة العمليات وقائمة الحسابات (لأن الرصيد نقص)
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      isClose(); // إغلاق المودال
      setExpenseData({ account: { id: account?.id || "" }, category: "", amount: "" }); // تصغير البيانات
    },
    onError: () => {
      setError({ hasError: true, message: "Failed to create expense. Please try again." });
    }
  });

  useEffect(() => {
    if (account && account.id) {
      setExpenseData((prev) => ({ ...prev, account: { id: account.id } }));
    }
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
    setError({ hasError: false, message: "" });
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    
    // 3. تنفيذ الـ Mutation
    mutation.mutate(expenseData);
  };

  const handleValidation = () => {
    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      setError({ hasError: true, message: "Amount must be greater than zero." });
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
          <form onSubmit={handleCreateExpense}>
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
                text={mutation.isPending ? "Saving..." : "Create Expense"}
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

export default CreateExpense;