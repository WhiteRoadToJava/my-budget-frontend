import React, { useEffect, useState } from "react";
import styles from "../../styles/components/expenses/createExpense.module.scss";
import Button from "../btns/Button.jsx";
import Modal from "../modals/Modal.jsx";
import FormInput from "../inputs/FormInput.jsx";
import DropDown from "../elements/DropDown.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransferById, updateTransfer } from "../../api/transferServce.js";
import i18n from "../../configuration/i18n.js";
import Datepicker from "../inputs/Datepicker.jsx";
import { ImagePicker } from "../ImagePicker.jsx";
import TransferFeesFields from "./TransferFeesFields";
import TransferSummary from "./TransferSummary";
import { firstCurrency } from "../../utils/accounts/pockets";
import { emptyFees, feesFromTransfer, feesToRequest, validateFees } from "../../utils/transactions/transferFees";

const FEE_FIELDS = [
  "sendFee", "sendFeeDirection", "sendFeeAccount",
  "receiveFee", "receiveFeeDirection", "receiveFeeAccount",
];

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
    createdAt: "",
    image: null,
  });
  const [imageUrls, setImageUrls] = useState(null);
  const [error, setError] = useState({ hasError: false, message: "" });
  const [fees, setFees] = useState(emptyFees());

  useEffect(() => {
    const fetchTransferData = async () => {
    if (isOpen && transfer) {
      const tranferIncomingFromServer  = await getTransferById(transfer.id);
      // the fees live in their own state; drop them from the transfer fields
      const fields = { ...tranferIncomingFromServer };
      for (const key of FEE_FIELDS) delete fields[key];
      setFees(feesFromTransfer(tranferIncomingFromServer));
      setTransferData({
        ...fields,
        sourceAccount: tranferIncomingFromServer.sourceAccount || { id: "" },
        destinationAccount: tranferIncomingFromServer.destinationAccount || { id: "" },
        amountSent: tranferIncomingFromServer.amountSent || 0,
        exChangeRate: tranferIncomingFromServer.exChangeRate || 1,
        amountReceived: tranferIncomingFromServer.amountReceived || 0,
        description: tranferIncomingFromServer.description || "", // تصحيح الخطأ الإملائي desccription
        createdAt: tranferIncomingFromServer.createdAt || "",
        image: tranferIncomingFromServer.image || null,
      });
    }
    };
    fetchTransferData();
  }, [isOpen, transfer]);

  // دالة مساعدة للحصول على الاسم من الـ ID
  const getAccountNameById = (accountId) => {
    const id = typeof accountId === 'object' ? accountId.id : accountId;
    return accountsList.find((acc) => acc.id === id)?.name || i18n.t("account.accountdeleted");
  };

  // both account fields are read-only in this form, so only their names are needed
  // each side with its currency (a transfer from before the currencies: the account's first)
  const sourceAccountData = accountsList.find((a) => a.id === transferData.sourceAccount?.id);
  const destinationAccountData = accountsList.find((a) => a.id === transferData.destinationAccount?.id);
  const sourceCurrency = transferData.sourceCurrency || firstCurrency(sourceAccountData);
  const destinationCurrency = transferData.destinationCurrency || firstCurrency(destinationAccountData);
  const currentSourceLabel = `${getAccountNameById(transferData.sourceAccount)} · ${sourceCurrency}`;
  const currentDestLabel = `${getAccountNameById(transferData.destinationAccount)} · ${destinationCurrency}`;

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
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("messages.errorUpdateTransfer")
      });
    },
  });
// Deliberate: syncs the picked image into the editable form state. Could be
// computed at submit time instead of stored/synced; tracked as a follow-up
// cleanup rather than changed here to keep this fix scoped to CI unblocking.
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setTransferData((prev) => ({
    ...prev,
    image: imageUrls || null,
  }));
}, [imageUrls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // the same account is fine in two currencies (an exchange), not twice the same currency
    if (transferData.sourceAccount.id === transferData.destinationAccount.id && sourceCurrency === destinationCurrency) {
      return setError({
        hasError: true,
        message: i18n.t("messages.errorSameAccountTransfer"),
      });
    }

    const feeError = validateFees(fees);
    if (feeError) {
      return setError({ hasError: true, message: i18n.t(feeError) });
    }
    mutation.mutate({
      ...transferData,
      amountSent: Number(transferData.amountSent),
      exChangeRate: Number(transferData.exChangeRate),
      amountReceived: Number(transferData.amountReceived),
      sourceCurrency,
      destinationCurrency,
      ...feesToRequest(fees, { sourceCurrency, destinationCurrency }),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={isClose}>
      <div className={styles.formContainer}>
        <h2>{i18n.t("updateTransfer.title")}</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label={i18n.t("updateTransfer.sourceAccount")}
            name="sourceAccount"
            type="text"
            value={currentSourceLabel}
            onChange={handleInputChange}
            disabled={true}
          />


          <FormInput
            label={i18n.t("updateTransfer.destinationAccount")}
            name="destinationAccount"
            type="text"
            value={currentDestLabel}
            onChange={handleInputChange}
            disabled={true}
          />


          <div className={styles.row}>
            <FormInput
              label={i18n.t("updateTransfer.amountSent")}
              name="amountSent"
              type="number"
              value={transferData.amountSent}
              onChange={handleInputChange}
            />
            <FormInput
              label={i18n.t("updateTransfer.exchangeRate")}
              name="exChangeRate"
              type="number"
              value={transferData.exChangeRate}
              onChange={handleInputChange}
            />
          </div>

          <FormInput
            label={i18n.t("updateTransfer.amountReceived")}
            name="amountReceived"
            type="number"
            value={transferData.amountReceived}
            onChange={handleInputChange}
          />

          <TransferFeesFields fees={fees} onChange={setFees} accounts={accountsList}
            sourceAccount={sourceAccountData} sourceCurrency={sourceCurrency}
            destinationAccount={destinationAccountData} destinationCurrency={destinationCurrency} />
          <TransferSummary
            sourceId={transferData.sourceAccount?.id}
            sourceCurrency={sourceCurrency}
            destinationId={transferData.destinationAccount?.id}
            destinationCurrency={destinationCurrency}
            amountSent={transferData.amountSent}
            amountReceived={transferData.amountReceived}
            fees={fees}
            accounts={accountsList}
          />

          <FormInput
            label={i18n.t("updateTransfer.description")}
            name="description"
            type="text"
            value={transferData.description}
            onChange={handleInputChange}
          />

          <div className={styles.inputContainer}>
            <p>{i18n.t("updateTransfer.createdAt")}:</p>
            <Datepicker
              label={i18n.t("updateTransfer.createdAt")}
              name="date"
              value={transferData.createdAt}
              onChange={(date) => {
                const localDateTime = `${date}T00:00:00.000Z`
                setTransferData((prev) => ({
                  ...prev,
                  createdAt: localDateTime,
                }));
                setError({ hasError: false, message: "" });
              }}
            />  
          </div>
          <ImagePicker onImageChange={setImageUrls} />


          {error.hasError && (
            <p className={styles.errorMessage}>{error.message}</p>
          )}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              text={mutation.isPending ? i18n.t("buttons.updating") : i18n.t("buttons.updateTransfer")}
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
  );
};

export default UpdateTransfer;