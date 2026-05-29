import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/incomes/createIncomse.module.scss";
import Button from "../../components/btns/Button";
import { addIncomse } from "../../api/incomseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";


const CreateIncomse = ({ isOpen, isClose, account }) => {
  const queryClient = useQueryClient();
  const [incomseData, setIncomseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });
  const [error, setError] = useState({ hasError: false, message: "" });

  const nutation = useMutation({
    mutationFn: addIncomse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      isClose();
      setIncomseData({ account: { id: account?.id || "" }, category: "", amount: "" });
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("message.errorCreateIncomse"),
      });
    }

  });


  const handleCreateIncomse = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    if (!handleValidation()) return; // Stop if validation fails;
    // Implement the logic to create an incomse using the API
    nutation.mutate(incomseData);
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
        message: i18n.t("message.amountless"),
      });
      return false;
    }
    if (!incomseData.category) {
      setError({ hasError: true, message: i18n.t("message.categoryRequired") });
      return false;
    }
    return true;
  };
  return (
    <div className={styles.createIncomseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
        <h2>{i18n.t("createIncomse.title")}</h2>
        <form>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createIncomse.amount")}
              name="amount"
              type="number"
              value={incomseData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <FormInput
              label={i18n.t("createIncomse.category")}
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
              text={nutation.isPending ? i18n.t("message.loading") : i18n.t("buttons.createIncomse")}
              type="submit"
              onClick={handleCreateIncomse}
            />
            <Button variant="cancel" text={i18n.t("buttons.cancel")} onClick={isClose} />
          </div>
        </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateIncomse;
