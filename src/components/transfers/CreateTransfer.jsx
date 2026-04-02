import React, { useEffect, useState } from "react";
import styles from "../../styles/components/ecpenses/createExpense.module.scss";
import Button from "../../components/btns/Button";
import Modal from "../../components/modals/Modal";
import FormInput from "../../components/inputs/FormInput";
import DropDown from "../elements/DropDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "../../api/transferServce.js";

const CreateTransfer = ({ isOpen, isClose, accounts, currentAccount }) => {
  const queryClient = useQueryClient();
  const [transferData, setTransferData] = useState({
    sourceAccount: { id: "" },
    destinationAccount: { id: "" },
    amountSent: 0,
    exChangeRate: 1,
    amountReceived: 0,
    description: "",
    category: "transfer", // أضفتها لتطابق طلبك السابق
  });

  const [error, setError] = useState({ hasError: false, message: "" });

  // استخراج الأسماء من المصفوفة بشكل آمن
  const accountsList = accounts?.accounts || [];

  // دالة مساعدة للحصول على اسم الحساب من الـ ID المخزن (لأغراض التصفية)
  const getAccountNameById = (id) =>
    accountsList.find((acc) => acc.id === id)?.name;
  const sourceName = getAccountNameById(transferData.sourceAccount.id);
  const destinationName = getAccountNameById(
    transferData.destinationAccount.id,
  );
  // القوائم المصفاة
  const filteredSourceList = accountsList
    .filter((acc) => acc.name !== destinationName)
    .map((acc) => acc.name);
  const filteredDestinationList = accountsList
    .filter((acc) => acc.name !== sourceName)
    .map((acc) => acc.name);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...transferData };
    if (name === "sourceAccount" || name === "destinationAccount") {
      // البحث عن الحساب بالاسم للحصول على الـ ID
      const selectedAccount = accountsList.find((acc) => acc.name === value);
      updatedData[name] = { id: selectedAccount ? selectedAccount.id : "" };
    } else {
      updatedData[name] = value;
    }
    // حساب المبلغ المستلم تلقائياً
    if (name === "amountSent") {
      const sent =
        name === "amountSent" ? Number(value) : Number(updatedData.amountSent);
      const rate =
        name === "exChangeRate"
          ? Number(value)
          : Number(updatedData.exChangeRate);
      updatedData.amountReceived = sent * rate;
    }
    if(name === "amountReceived"){
      const received =
        name === "amountReceived" ? Number(value) : Number(updatedData.amountReceived);
      const sent =
        name === "amountSent" ? Number(value) : Number(updatedData.amountSent);
      updatedData.exChangeRate = received / sent;
    }
    setTransferData(updatedData);
    setError({ hasError: false, message: "" });
  };

  useEffect(() => {
    const selectCurrentAccount = () => {
      if (isOpen && currentAccount) {
        setTransferData((prev) => ({
          ...prev,
          sourceAccount: { id: currentAccount.id },
          destinationAccount: { id: "" }
        }));
      }
    };
    selectCurrentAccount();
    console.log(currentAccount);
  }, [isOpen, currentAccount]);

  const mutation = useMutation({
    mutationFn: (data) => createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      isClose();
      setTransferData({
        sourceAccount: { id: "" },
        destinationAccount: { id: "" },
        amountSent: 0,
        exChangeRate: 1,
        amountReceived: 0,
        description: "",
        category: "transfer",
      });
    },
    onError: (err) => {
      setError({
        hasError: true,
        message: "Error: " + (err.response?.data?.message || err.message),
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من أن الحسابين مختلفين باستخدام الـ ID
    if (transferData.sourceAccount.id === transferData.destinationAccount.id) {
      return setError({
        hasError: true,
        message: "Source and Destination accounts must be different.",
      });
    }
    const finalPayload = {
      ...transferData,
      amountSent: Number(transferData.amountSent),
      exChangeRate: Number(transferData.exChangeRate),
    };
    mutation.mutate(finalPayload);
    console.log(finalPayload);
  };

  const selectedSourceName = getAccountNameById(transferData.sourceAccount.id);
  const selectedDestName = getAccountNameById(
    transferData.destinationAccount.id,
  );
  return (
    <Modal isOpen={isOpen} onRequestClose={isClose}>
      <div className={styles.formContainer}>
        <h2>Create Transfer</h2>
        <form onSubmit={handleSubmit}>
          <DropDown
            label="Source Account"
            placeholder="Select a source account"
            list={filteredSourceList}
            name="sourceAccount"
            value={selectedSourceName} // هذا هو المهم للعرض
            onChange={handleInputChange}
          />

          <DropDown
            label="Destination Account"
            list={filteredDestinationList}
            name="destinationAccount"
            value={selectedDestName}
            onChange={handleInputChange}
          />

          <div className={styles.row}>
            <FormInput
              label="Amount Sent"
              name="amountSent"
              type="number"
              value={transferData.amountSent}
              onChange={handleInputChange}
            />
            <FormInput
              label="Exchange Rate"
              name="exChangeRate"
              type="number"
              value={transferData.exChangeRate}
              onChange={handleInputChange}
            />
          </div>

          <FormInput
            label="Amount To Receive"
            name="amountReceived"
            type="number"
            value={transferData.amountReceived}
            onChange={handleInputChange}
          />

          <FormInput
            label="Description"
            name="description"
            type="text"
            value={transferData.description || ""}
            onChange={handleInputChange}
          />

          {error.hasError && (
            <p className={styles.errorMessage}>{error.message}</p>
          )}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={mutation.isPending ? "Processing..." : "Confirm Transfer"}
              type="submit"
              disabled={mutation.isPending}
            />
            <Button
              variant="cancel"
              text="Cancel"
              onClick={isClose}
              type="button"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTransfer;
