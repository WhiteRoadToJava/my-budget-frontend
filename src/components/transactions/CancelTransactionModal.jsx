import React, { useState } from "react";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// Asks before cancelling: the transaction stays in the history, struck through, and its
// money goes back (for a transfer, the fees too). The reason is optional.
// Rendered only while open. onConfirm(reason).
const CancelTransactionModal = ({ onClose, onConfirm, isTransfer, isPending }) => {
  const [reason, setReason] = useState("");

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form
        className={sheet.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(reason.trim());
        }}
      >
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("cancel.title")}</h2>
          <p className={sheet.subtitle}>
            {i18n.t(isTransfer ? "cancel.explainTransfer" : "cancel.explain")}
          </p>
        </header>

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
