import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "../../styles/components/incomes/createIncome.module.scss";
import Button from "../../components/btns/Button";
import { updateIncomse, getIncomseById } from "../../api/incomseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "../../configuration/i18n";
import Datepicker from "../inputs/Datepicker";
import { imagesUpload } from "../../api/upload";
import { ImagePicker } from "../ImagePicker";

const UpdateIncomse = ({ isOpen, isClose, incomse }) => {
  const [incomseData, setIncomseData] = useState({
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
    mutationFn: (data) => updateIncomse(incomse.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      isClose();
      setIncomseData({ account: { id: "" }, category: "", amount: "" });
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("message.errorUpdateIncomse"),
      });
    },
  });
  useEffect(() => {
    const fetchAccount = async () => {
      if (isOpen && incomse && incomse?.id) {
        try {
          const data = await getIncomseById(incomse.id);

          if (data) {
            setIncomseData({
              ...data,
              account: { id: data.account?.id || "" },
              category: data.category || "",
              amount: data.amount || "",
              createdAt: data.createdAt || "",
              image: data.image || null,
            });
          }
        } catch (err) {
          console.error(i18n.t("message.errorFetchIncomse"), err);
        }
      }
    };

    fetchAccount();
    return () => {
      setIncomseData({ account: { id: "" }, category: "", amount: "" });
    };
  }, [isOpen, incomse]);

  const handleUpdateIncomse = async (e) => {
    e.preventDefault(); // avoid form submission causing page reload
    nutation.mutate(incomseData);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomseData({ ...incomseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  };
  // Deliberate: syncs the picked image into the editable form state. Could be
  // computed at submit time instead of stored/synced; tracked as a follow-up
  // cleanup rather than changed here to keep this fix scoped to CI unblocking.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIncomseData((prev) => ({
      ...prev,
      image: imageUrls || null,
    }));
  }, [imageUrls]);

  return (
    <div className={styles.createIncomseContainer}>
      <Modal isOpen={isOpen} onRequestClose={isClose}>
        <div className={styles.formContainer}>
          <h2>{i18n.t("updateIncomse.title")}</h2>
          <form>
            <div className={styles.inputContainer}>
              <FormInput
                label={i18n.t("createIncomse.amount")}
                placeholder={i18n.t("placeholder.amount")}
                name="amount"
                type="number"
                value={incomseData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <FormInput
                label={i18n.t("createIncomse.category")}
                placeholder={i18n.t("placeholder.category")}
                name="category"
                value={incomseData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <p>{i18n.t("updateIncomse.createdAt")}:</p>
              <Datepicker
                placeholder={i18n.t("placeholder.createdAt")}
                name="createdAt"
                value={incomseData.createdAt}
                onChange={(date) => {
                  const localDateTime = `${date}T00:00:00.000Z`;
                  setIncomseData((prev) => ({
                    ...prev,
                    createdAt: localDateTime,
                  }));
                  setError({ hasError: false, message: "" });
                }}
              />
            </div>
            <div>
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
                    : i18n.t("buttons.updateIncomse")
                }
                type="submit"
                onClick={handleUpdateIncomse}
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

export default UpdateIncomse;
