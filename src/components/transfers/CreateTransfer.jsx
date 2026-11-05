import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import { ImagePicker } from "../ImagePicker.jsx";
import TransferFeesFields from "./TransferFeesFields";
import TransferSummary from "./TransferSummary";
import { createTransfer } from "../../api/transferServce.js";
import { emptyFees, feesToRequest, validateFees } from "../../utils/transactions/transferFees";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/transfers/transferForm.module.scss";
import i18n from "../../configuration/i18n.js";

const emptyTransfer = (sourceId = "") => ({
  sourceAccount: { id: sourceId },
  destinationAccount: { id: "" },
  amountSent: "",
  exChangeRate: 1,
  amountReceived: "",
  description: "",
});

const hasAnyFee = (fees) => Number(fees.sendFee) > 0 || Number(fees.receiveFee) > 0;

// The form lives in its own component and is rendered only while open,
// so every opening starts from the props (current account or duplicate).
const TransferForm = ({ onClose, accounts, currentAccount, initialData }) => {
  const queryClient = useQueryClient();
  const accountsList = accounts?.accounts || [];

  // a duplicate brings its fees separately from the transfer fields
  const { fees: initialFees, ...initialTransfer } = initialData ?? {};
  const [transferData, setTransferData] = useState(() => ({
    ...emptyTransfer(currentAccount?.id ?? ""),
    ...initialTransfer,
  }));
  const [fees, setFees] = useState(() => initialFees ?? emptyFees());
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const accountById = (id) => accountsList.find((a) => a.id === id);
  const source = accountById(transferData.sourceAccount.id);
  const destination = accountById(transferData.destinationAccount.id);
  // one currency: the rate is 1 and what arrives is what was sent
  const sameCurrency = !source || !destination || source.currency === destination.currency;

  const set = (changes) => {
    setTransferData((prev) => ({ ...prev, ...changes }));
    setError(null);
  };

  const chooseAccount = (side, name) => {
    const account = accountsList.find((a) => a.name === name);
    const other = side === "sourceAccount" ? destination : source;
    const changes = { [side]: { id: account?.id ?? "" } };
    // same currency on both sides: no rate, what arrives is what was sent
    if (!account || !other || account.currency === other.currency) {
      changes.exChangeRate = 1;
      changes.amountReceived = transferData.amountSent;
    }
    set(changes);
  };

  // keep sent, rate and received consistent whichever one the user edits
  const changeSent = (value) =>
    set({ amountSent: value, amountReceived: value === "" ? "" : Number(value) * Number(transferData.exChangeRate || 1) });
  const changeRate = (value) =>
    set({ exChangeRate: value, amountReceived: Number(transferData.amountSent || 0) * Number(value || 0) });
  const changeReceived = (value) =>
    set({
      amountReceived: value,
      exChangeRate: Number(transferData.amountSent) ? Number(value) / Number(transferData.amountSent) : transferData.exChangeRate,
    });

  const mutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: () => setError(i18n.t("messages.errorCreateTransfer")),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transferData.sourceAccount.id || !transferData.destinationAccount.id) {
      return setError(i18n.t("messages.accountRequired"));
    }
    if (transferData.sourceAccount.id === transferData.destinationAccount.id) {
      return setError(i18n.t("messages.errorSameAccountTransfer"));
    }
    if (!(Number(transferData.amountSent) > 0)) {
      return setError(i18n.t("messages.amountless"));
    }
    const feeError = validateFees(fees);
    if (feeError) return setError(i18n.t(feeError));

    mutation.mutate({
      ...transferData,
      amountSent: Number(transferData.amountSent),
      exChangeRate: Number(transferData.exChangeRate),
      amountReceived: Number(transferData.amountReceived),
      category: "transfer",
      image,
      ...feesToRequest(fees),
    });
  };

  const names = (excludeId) => accountsList.filter((a) => a.id !== excludeId).map((a) => a.name);

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} onSubmit={handleSubmit} noValidate>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("createTransfer.title")}</h2>
        </header>

        <div className={styles.route}>
          <DropDown
            label={i18n.t("createTransfer.sourceAccount")}
            placeholder={i18n.t("placeholder.sourceAccount")}
            list={names(transferData.destinationAccount.id)}
            name="sourceAccount"
            value={source?.name ?? ""}
            onChange={(e) => chooseAccount("sourceAccount", e.target.value)}
          />
          <span className={styles.arrow} aria-hidden="true">→</span>
          <DropDown
            label={i18n.t("createTransfer.destinationAccount")}
            placeholder={i18n.t("placeholder.destinationAccount")}
            list={names(transferData.sourceAccount.id)}
            name="destinationAccount"
            value={destination?.name ?? ""}
            onChange={(e) => chooseAccount("destinationAccount", e.target.value)}
          />
        </div>

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="transfer-sent">
            {i18n.t("createTransfer.amountSent")}
          </label>
          <div className={sheet.money}>
            <input
              id="transfer-sent"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0"
              value={transferData.amountSent}
              onChange={(e) => changeSent(e.target.value)}
            />
            <span className={sheet.moneyCurrency}>{source?.currency ?? ""}</span>
          </div>
        </div>

        {!sameCurrency && (
          <div className={styles.amounts}>
            <FormInput
              label={i18n.t("createTransfer.exchangeRate")}
              name="exChangeRate"
              type="number"
              step="any"
              value={transferData.exChangeRate}
              onChange={(e) => changeRate(e.target.value)}
            />
            <FormInput
              label={`${i18n.t("createTransfer.amountReceived")} (${destination?.currency ?? ""})`}
              name="amountReceived"
              type="number"
              step="0.01"
              value={transferData.amountReceived}
              onChange={(e) => changeReceived(e.target.value)}
            />
          </div>
        )}

        <details className={styles.fees} open={hasAnyFee(fees)}>
          <summary>{i18n.t("transferFees.title")}</summary>
          <div>
            <TransferFeesFields fees={fees} onChange={setFees} accounts={accountsList} />
          </div>
        </details>

        <TransferSummary
          sourceId={transferData.sourceAccount.id}
          destinationId={transferData.destinationAccount.id}
          amountSent={transferData.amountSent}
          amountReceived={transferData.amountReceived}
          fees={fees}
          accounts={accountsList}
        />

        <FormInput
          label={i18n.t("createTransfer.description")}
          name="description"
          type="text"
          value={transferData.description || ""}
          onChange={(e) => set({ description: e.target.value })}
        />
        <ImagePicker onImageChange={setImage} />

        {error && (
          <p className={sheet.error} role="alert">
            {error}
          </p>
        )}

        <div className={sheet.actions}>
          <Button variant="cancel" text={i18n.t("buttons.cancel")} onClick={onClose} type="button" />
          <Button
            variant="primary"
            type="submit"
            text={mutation.isPending ? i18n.t("buttons.processing") : i18n.t("buttons.createTransfer")}
            disabled={mutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

// isOpen / isClose: same props as before, so the callers do not change
const CreateTransfer = ({ isOpen, isClose, accounts, currentAccount, initialData }) =>
  isOpen ? (
    <TransferForm onClose={isClose} accounts={accounts} currentAccount={currentAccount} initialData={initialData} />
  ) : null;

export default CreateTransfer;
