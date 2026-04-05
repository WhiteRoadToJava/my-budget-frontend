import React, { useEffect, useState } from "react";
import styles from "../../styles/components/ecpenses/createExpense.module.scss";
import Button from "../btns/Button.jsx";
import Modal from "../modals/Modal.jsx";
import FormInput from "../inputs/FormInput.jsx";
import DropDown from "../elements/DropDown.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransferById, updateTransfer } from "../../api/transferServce.js";

const UpdateTransfer = ({ isOpen, isClose, accounts, transfer }) => {
  const queryClient = useQueryClient();
  const accountsList = accounts?.accounts || [];

  // 1. الحالة الابتدائية (Initial State)
  const [transferData, setTransferData] = useState({
    sourceAccount: { id: "" },
    destinationAccount: { id: "" },
    amountSent: 0,
    exChangeRate: 1,
    amountReceived: 0,
    description: "",
    category: "transfer",
  });

  const [error, setError] = useState({ hasError: false, message: "" });

  useEffect(() => {
    const fetchTransferData = async () => {
    if (isOpen && transfer) {
      const tranferIncomingFromServer  = await getTransferById(transfer.id);
      setTransferData({
        ...tranferIncomingFromServer,
        sourceAccount: tranferIncomingFromServer.sourceAccount || { id: "" },
        destinationAccount: tranferIncomingFromServer.destinationAccount || { id: "" },
        amountSent: tranferIncomingFromServer.amountSent || 0,
        exChangeRate: tranferIncomingFromServer.exChangeRate || 1,
        amountReceived: tranferIncomingFromServer.amountReceived || 0,
        description: tranferIncomingFromServer.description || "", // تصحيح الخطأ الإملائي desccription
      });
    }
    };
    fetchTransferData();
  }, [isOpen, transfer]);

  // دالة مساعدة للحصول على الاسم من الـ ID
  const getAccountNameById = (accountId) => {
    const id = typeof accountId === 'object' ? accountId.id : accountId;
    return accountsList.find((acc) => acc.id === id)?.name || "";
  };

  // تصفية القوائم لمنع اختيار نفس الحساب
  const currentSourceLabel = getAccountNameById(transferData.sourceAccount);
  const currentDestLabel = getAccountNameById(transferData.destinationAccount);

  const filteredSourceList = accountsList
    .filter((acc) => acc.name !== currentDestLabel)
    .map((acc) => acc.name);

  const filteredDestinationList = accountsList
    .filter((acc) => acc.name !== currentSourceLabel)
    .map((acc) => acc.name);

  // 3. معالج المدخلات الديناميكي
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...transferData };

    if (name === "sourceAccount" || name === "destinationAccount") {
      const selectedAccount = accountsList.find((acc) => acc.name === value);
      updatedData[name] = { id: selectedAccount ? selectedAccount.id : "" };
    } else {
      updatedData[name] = value;
    }

    // الحسابات التلقائية للعملات
    if (name === "amountSent" || name === "exChangeRate") {
      updatedData.amountReceived = 
        Number(updatedData.amountSent) * Number(updatedData.exChangeRate);
    }
    if (name === "amountReceived") {
      updatedData.exChangeRate = 
        Number(updatedData.amountReceived) / (Number(updatedData.amountSent) || 1);
    }

    setTransferData(updatedData);
    setError({ hasError: false, message: "" });
  };

  // 4. تنفيذ التعديل باستخدام React Query
  const mutation = useMutation({
    mutationFn: (data) => updateTransfer(transfer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      isClose();
    },
    onError: (err) => {
      setError({
        hasError: true,
        message: "Update failed: " + (err.response?.data?.message || err.message),
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (transferData.sourceAccount.id === transferData.destinationAccount.id) {
      return setError({
        hasError: true,
        message: "Source and Destination accounts must be different.",
      });
    }

    mutation.mutate({
      ...transferData,
      amountSent: Number(transferData.amountSent),
      exChangeRate: Number(transferData.exChangeRate),
      amountReceived: Number(transferData.amountReceived),
      
    });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={isClose}>
      <div className={styles.formContainer}>
        <h2>Update Transfer</h2>
        <form onSubmit={handleSubmit}>
          <DropDown
            label="Source Account"
            list={filteredSourceList}
            name="sourceAccount"
            value={currentSourceLabel}
            onChange={handleInputChange}
          />

          <DropDown
            label="Destination Account"
            list={filteredDestinationList}
            name="destinationAccount"
            value={currentDestLabel}
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
            label="Amount Received"
            name="amountReceived"
            type="number"
            value={transferData.amountReceived}
            onChange={handleInputChange}
          />

          <FormInput
            label="Description"
            name="description"
            type="text"
            value={transferData.description}
            onChange={handleInputChange}
          />

          {error.hasError && (
            <p className={styles.errorMessage}>{error.message}</p>
          )}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={mutation.isPending ? "Updating..." : "Update Transfer"}
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

export default UpdateTransfer;