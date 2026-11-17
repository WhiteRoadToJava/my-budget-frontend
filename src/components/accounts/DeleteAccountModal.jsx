import React, { useState } from "react";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import { confirmsDelete } from "../../utils/accounts/deleteAccount.js"
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/accounts/deleteAccount.module.scss";
import i18n from "../../configuration/i18n";

// Deleting an account also deletes its income, expenses and schedules, so the user
// must type the account's name or the word "delete" by hand: pasting and dropping
// text are blocked and the button stays disabled until the text matches.
// Rendered only while open, so every opening starts empty.
const DeleteAccountModal = ({ account, onClose, onDelete, onArchive, isPending }) => {
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState(null);
  const localWord = i18n.t("deleteAccount.word");
  const matches = confirmsDelete(typed, account.name, localWord);

  const submit = (e) => {
    if(matches && !isPending) onDelete(typed.trim());
    e.preventDefault();
    if (matches && !isPending) onDelete();
  };

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} noValidate onSubmit={submit}>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("deleteAccount.title")}</h2>
          <p className={sheet.subtitle}>{i18n.t("deleteAccount.warning")}</p>
        </header>

        {onArchive && (
          <p className={styles.alternative}>
            {i18n.t("deleteAccount.archiveHint")}{" "}
            <button type="button" onClick={onArchive}>{i18n.t("deleteAccount.archiveInstead")}</button>
          </p>
        )}

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="delete-account-confirm">
            {i18n.t("deleteAccount.typeLabel", { word: localWord })}{" "}
            <span className={styles.name}>{account.name}</span>
          </label>
          <input id="delete-account-confirm" className={styles.input} type="text"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            value={typed}
            onChange={(e) => { setTyped(e.target.value); setHint(null); }}
            onPaste={(e) => { e.preventDefault(); setHint(i18n.t("deleteAccount.noPaste")); }}
            onDrop={(e) => e.preventDefault()} />
          {hint && <p className={sheet.hint} role="status">{hint}</p>}
        </div>

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button variant="delete" type="submit" disabled={!matches || isPending}
            text={isPending ? i18n.t("buttons.processing") : i18n.t("deleteAccount.confirm")} />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;