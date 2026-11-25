import React, { useState } from "react";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import TransactionDateField from "../inputs/TransactionDateField";
import { isFutureDay, todayString } from "../../utils/transactions/transactionDate";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// Asks before cancelling: the transaction stays on its own day, and a cancellation row on the
// chosen day takes its money back (for a transfer, the fees too). The reason is optional.
// firstDay ("yyyy-MM-dd"): the transaction's own day, the earliest it can be cancelled.
// Rendered only while open. onConfirm(reason, day).
const CancelTransactionModal = ({ onClose, onConfirm, isTransfer, isPending, firstDay }) => {
  const [reason, setReason] = useState("");
  const [day, setDay] = useState(todayString);
  const [error, setError] = useState("");

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form
        className={sheet.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isFutureDay(day)) return setError(i18n.t("transactionDate.future"));
          if (firstDay && day < firstDay) return setError(i18n.t("cancel.beforeTransaction"));
          onConfirm(reason.trim(), day);
        }}
      >
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("cancel.title")}</h2>
          <p className={sheet.subtitle}>
            {i18n.t(isTransfer ? "cancel.explainTransfer" : "cancel.explain")}
          </p>
        </header>

        <TransactionDateField
          className={sheet.field}
          labelClassName={sheet.label}
          value={day}
          onChange={(value) => {
            setDay(value);
            setError("");
          }}
          min={firstDay}
        />

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="cancel-reason">
            {i18n.t("cancel.reason")} <span className={sheet.optional}>({i18n.t("cancel.optional")})</span>
          </label>
          <textarea
            id="cancel-reason"
            className={sheet.textarea}
            rows={3}
            maxLength={200}
            value={reason}
            placeholder={i18n.t("cancel.reasonPlaceholder")}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {error && <p className={sheet.error}>{error}</p>}

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button variant="delete" type="submit" disabled={isPending}
            text={isPending ? i18n.t("buttons.processing") : i18n.t("cancel.confirm")} />
        </div>
      </form>
    </Modal>
  );
};

export default CancelTransactionModal;
