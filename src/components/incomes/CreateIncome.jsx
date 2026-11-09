import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import AmountWithCurrency from "../inputs/AmountWithCurrency";
import { firstCurrency } from "../../utils/accounts/pockets";
import styles from "../../styles/components/incomes/createIncome.module.scss";
import Button from "../../components/btns/Button";
import { addIncomse } from "../../api/incomseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";
import { ImagePicker } from "../ImagePicker";
import {incomseCategoryList} from "../../assiets/categories/assits"
import IncomeCategoryList from "../categories/IncomeCategoryList.jsx";


// currency: the currency of the account the money is in (empty = the account's first one)
const CreateIncomse = ({ isOpen, isClose, account, initialData, currency }) => {
  const queryClient = useQueryClient();
  const [incomseData, setIncomseData] = useState({
    category: initialData?.category ?? "",
    amount: initialData?.amount ?? "",
    description: initialData?.description ?? "",
    inage: null,
  });
  const [imageUrls, setImageUrls] = useState(null);
  const [error, setError] = useState({ hasError: false, message: "" });

  const nutation = useMutation({
    mutationFn: addIncomse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      isClose();
      setIncomseData({ category: "", amount: "", description: "" });
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("messages.errorCreateIncomse"),
      });
    }

  });

  const handleCreateIncomse = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    if (!handleValidation()) return; // Stop if validation fails;
    // Implement the logic to create an incomse using the API
    nutation.mutate({
      ...incomseData,
      account: { id: account?.id || "" },
      currency: chosenCurrency,
      image: imageUrls || null,
    });
  };

  // the currency next to the amount: picked here, else the tab's, else the account's first
  const chosenCurrency = incomseData.currency || currency || initialData?.currency || firstCurrency(account);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomseData({ ...incomseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };
  const handleValidation = () => {
    if (!incomseData.amount || parseFloat(incomseData.amount) <= 0) {
      setError({
        hasError: true,
        message: i18n.t("messages.amountless"),
      });
      return false;
    }
    if (!incomseData.category) {
      setError({ hasError: true, message: i18n.t("messages.categoryRequired") });
      return false;
    }
    return true;
  };

  const handleCategoryChange = (id) => {
    const category = incomseCategoryList.find((item) => item.id === id);
    if (category) {
      setIncomseData({ ...incomseData, category: category.id });
    }
  }
  return (
    <div className={styles.createIncomseContainer}>
      <Modal isOpen={isOpen} onClose={isClose}>
        <div className={styles.formContainer}>
        <h2>{i18n.t("createIncomse.title")}</h2>
        <form>
          <div className={styles.inputContainer}>
            <AmountWithCurrency
              label={i18n.t("createIncomse.amount")}
              placeholder={i18n.t("placeholder.amount")}
              value={incomseData.amount}
              onChange={handleInputChange}
              account={account}
              currency={chosenCurrency}
              onCurrencyChange={(code) => setIncomseData((prev) => ({ ...prev, currency: code }))}
            />
          </div>
          <div>
            <IncomeCategoryList incomseItem={handleCategoryChange} value={incomseData.category} />
          </div>
          <div className={styles.inputContainer}>
            <FormInput
              label={i18n.t("createIncomse.description")}
              placeholder={i18n.t("placeholder.description")}
              name="description"
              type="text"
              value={incomseData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <ImagePicker onImageChange={setImageUrls} />
          </div>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={nutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.createIncomse")}
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
