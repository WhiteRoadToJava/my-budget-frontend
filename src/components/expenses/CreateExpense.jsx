import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "../../styles/components/expenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import { addExpense } from "../../api/expenseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";
import { ImagePicker } from "../ImagePicker";
import { expenseCategoryList } from "../../assiets/categories/assits";
import ExpenseCategoryList from "../categories/ExpenseCategoryList";

const CreateExpense = ({ isOpen, isClose, account }) => {
  const queryClient = useQueryClient();

  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    image: null,
  });
  const [imageUrls, setImageUrls] = useState(null);

  const [error, setError] = useState({ hasError: false, message: "" });

  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      isClose(); // إغلاق المودال
      setExpenseData({
        category: "",
        amount: "",
      }); // تصغير البيانات
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("message.errorCreateExpense"),
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
    setError({ hasError: false, message: "" });
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    const filnalExpenseData = {
      ...expenseData,
      account: { id: account?.id || "" },
      image: imageUrls || null,
    };
    // 3. تنفيذ الـ Mutation
    setExpenseData(filnalExpenseData);
    mutation.mutate(filnalExpenseData);
  };

  const handleValidation = () => {
    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      setError({ hasError: true, message: i18n.t("message.amountless") });
      return false;
    }
    if (!expenseData.category) {
      setError({ hasError: true, message: i18n.t("message.categoryRequired") });
      return false;
    }
    return true;
  };


    const handleCategoryChange = (id) => {
      const category = expenseCategoryList.find((item) => item.id === id);
      if (category) {
        setExpenseData({ ...expenseData, category: category.id });
      }
    }

  return (
    <div className={styles.createExpenseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
          <h2>{i18n.t("createExpense.title")}</h2>
          <form onSubmit={handleCreateExpense}>
            <div className={styles.inputContainer}>
              <FormInput
                label={i18n.t("createExpense.amount")}
                placeholder={i18n.t("placeholder.amount")}
                name="amount"
                type="number"
                value={expenseData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <ExpenseCategoryList expenseItem={handleCategoryChange} />
            </div>
            <div>
              {error.hasError && (
                <p style={{ color: "red" }}>{error.message}</p>
              )}
            </div>
            <div>
              <ImagePicker onImageChange={setImageUrls} />
            </div>
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                text={
                  mutation.isPending
                    ? i18n.t("message.loading")
                    : i18n.t("buttons.createExpense")
                }
                type="submit"
                disabled={mutation.isPending}
              />
              <Button
                variant="cancel"
                text={i18n.t("buttons.cancel")}
                onClick={isClose}
                type="button"
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateExpense;