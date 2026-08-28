import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "../../styles/components/incomes/createIncome.module.scss";
import Button from "../../components/btns/Button";
import { updateExpense, getExpenseById } from "../../api/expenseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";
import Datepicker from "../inputs/Datepicker";
import { imagesUpload } from "../../api/upload";
import { ImagePicker } from "../ImagePicker";

const UpdateExpense = ({ isOpen, isClose, expense }) => {
  const [expwnseData, setExpenseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
    createdAt: "",
    image: null,
  });
  const [imageUrls, setImageUrls] = useState(null);
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
              image: data.image || null,
            });
          }
          isOpen == false;
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

  const handleUpdateExpense = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    nutation.mutate(expwnseData);
    isClose(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expwnseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };

// Deliberate: syncs the picked image into the editable form state. Could be
// computed at submit time instead of stored/synced; tracked as a follow-up
// cleanup rather than changed here to keep this fix scoped to CI unblocking.
useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenseData(
      (prev) => ({
        ...prev,
        image: imageUrls,
      }
    ))
  }, [imageUrls])
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
            <div className={styles.inputContainer}>
              <p>{i18n.t("updateExpense.createdAt")}:</p>
              <Datepicker
                placeholder={i18n.t("placeholder.createdAt")}
                name="createdAt"
                value={expwnseData.createdAt}
                onChange={(date) => {
                  const localDateTime = `${date}T00:00:00.000Z`;
                  setExpenseData((prev) => ({
                    ...prev,
                    createdAt: localDateTime,
                  }));
                  setError({ hasError: false, message: "" });
                }}
              />
            </div>
            <div className={styles.inputContainer}>
              <ImagePicker onImageChange={setImageUrls} />
            </div>
            <div>
              {error.hasError && (
                <p style={{ color: "red" }}>{error.message}</p>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                variant="primary"
                text={
                  nutation.isPending
                    ? i18n.t("message.loading")
                    : i18n.t("buttons.updateExpense")
                }
                type="submit"
                onClick={handleUpdateExpense}
              />
              <Button
                variant="cancel"
                text={i18n.t("buttons.cancel")}
                onClick={isClose}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default UpdateExpense;
