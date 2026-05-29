import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/incomes/createIncomse.module.scss";
import Button from "../../components/btns/Button";
import { updateExpense, getExpenseById } from "../../api/expenseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";



const UpdateExpense = ({ isOpen, isClose, expense }) => {
  const [expwnseData, setExpenseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });
  const [error, setError] = useState({ hasError: false, message: "" });
  const queryClient = useQueryClient();
  const nutation = useMutation({
    mutationFn: (data) => updateExpense(expense.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      isClose();
      setExpenseData({ account: { id: "" }, category: "", amount: "" });
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("message.errorUpdateExpense"),
      });
    },
  });
  useEffect(() => {
    const fetchAccount = async () => {
      if (isOpen && expense && expense?.id) {
        try {
          const data = await getExpenseById(expense.id);
          if (data) {
            setExpenseData({
              ...data,
              account: { id: data.account?.id || "" },
              category: data.category || "",
              amount: data.amount || "",
            });
          }
        } catch (err) {
          console.error("Error fetching expense:", err);
        }
      }
    };

    fetchAccount();
    return () => {
      setExpenseData({ account: { id: "" }, category: "", amount: "" });
    };
  }, [isOpen, expense]);

  const handleUpdateIncomse = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    nutation.mutate(expwnseData);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expwnseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };

  return (
    <div className={styles.createIncomseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
          <h2>{i18n.t("updateExpense.title")}</h2>
          <form>
            <div className={styles.inputContainer}>
              <FormInput
                label={i18n.t("updateExpense.amount")}
                placeholder={i18n.t("placeholder.amount")}
                name="amount"
                type="number"
                value={expwnseData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <FormInput
                label={i18n.t("updateExpense.category")}
                placeholder={i18n.t("placeholder.category")}
                name="category"
                value={expwnseData.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              {error.hasError && (
                <p style={{ color: "red" }}>{error.message}</p>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                text={nutation.isPending ? i18n.t("message.loading") : i18n.t("buttons.updateExpense")}
                type="submit"
                onClick={handleUpdateIncomse}
              />
              <Button variant="cancel" text={i18n.t("buttons.cancel")} onClick={isClose} />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default UpdateExpense;
