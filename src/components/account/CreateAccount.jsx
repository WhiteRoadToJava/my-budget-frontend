import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/ecpenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import { addAccount } from "../../api/accountService";
import DropDown from "../elements/DropDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";
const currencies = [
  "USD", // DOLLAR
  "EUR", // EURO
  "SEK",
  "AED", 
  "TRY",
  "SAR",
  "AED",
  "GBP",
  "JPY",
];
const type = ["NORMAL", "COMPANY"];

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
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      setAccountData({ name: "", balance: 0, currency: "", type: "" });
      isClose();
    },
    onError: (err) => {
      setError({
        hasError: true,
        message: i18n.t("messages.errorAddAccount") + err.message,
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
    setError({ hasError: false, message: "" });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

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
    if (!accountData.type.trim) {
      setError({ hasError: true, message: "Type is required." });
      return false;
    }
    return true;
  };

  return (
    <div className={styles.createExpenseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
          <h2>{i18n.t("createAccount.title")}</h2>
          <form onSubmit={handleCreateAccount}>
            <div className={styles.inputContainer}>
              <FormInput
                label={i18n.t("createAccount.name")}
                placeholder={i18n.t("placeholder.name")}
                name="name"
                type="text"
                value={accountData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <FormInput
                label={i18n.t("createAccount.balance")}
                placeholder={i18n.t("placeholder.balance")}
                name="balance"
                type="number"
                value={accountData.balance}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <DropDown
                label={i18n.t("createAccount.currency")}
                placeholder={i18n.t("placeholder.currency")}
                name="currency"
                value={accountData.currency}
                onChange={handleInputChange}
                list={currencies}
              />
            </div>
            <div>
              <DropDown
                label={i18n.t("createAccount.type")}
                placeholder={i18n.t("placeholder.type")}
                name="type"
                value={accountData.type}
                onChange={handleInputChange}
                list={type}
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
                text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.addAccount")}
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

export default CreateAccount;
