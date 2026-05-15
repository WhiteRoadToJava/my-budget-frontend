import React, { useEffect, useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import styles from "..//../styles/components/incomes/createIncomse.module.scss";
import Button from "../../components/btns/Button";
import { updateIncomse, getIncomseById} from "../../api/incomseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateIncomse = ({ isOpen, isClose, incomse }) => {
  const [incomseData, setIncomseData] = useState({
    account: { id: "" },
    category: "",
    amount: "",
  });
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
        message: "Failed to update incomse. Please try again.",
      });
    }
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
            });
          }
        } catch (err) {
          console.error("Error fetching income:", err);
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
    console.log(incomse.id)
    nutation.mutate(incomseData);
    };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomseData({ ...incomseData, [name]: value });
    setError({ hasError: false, message: "" }); // Clear error on input change
  }

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
                  text="Update Incomse"
                  type="submit"
                  onClick={handleUpdateIncomse}
                />
                <Button variant="cancel" text="Cancel" onClick={isClose} />
              </div>
            </form>
            </div>
          </Modal>
        </div>
  )
}

export default UpdateIncomse
