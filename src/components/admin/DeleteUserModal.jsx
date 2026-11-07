import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import Button from "../btns/Button";
import { deleteUser } from "../../api/subscriptionService";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/admin/admin.module.scss";
import i18n from "../../configuration/i18n";

// Deleting is permanent, so the admin must type the user's email by hand:
// pasting and dropping text are blocked, and the button stays disabled until
// the email matches. The backend checks the same email again.
// Rendered only while open.
const DeleteUserModal = ({ onClose, user }) => {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const matches = typed.trim().toLowerCase() === user.username.toLowerCase();

  const mutation = useMutation({
    mutationFn: () => deleteUser(user.id, typed.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.removeQueries({ queryKey: ["admin", "user", user.id] });
      navigate("/admin/users", { state: { deleted: user.username } });
    },
    onError: (err) =>
      setError(typeof err?.response?.data === "string" && err.response.data ? err.response.data : i18n.t("admin.saveError")),
  });

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} noValidate onSubmit={(e) => { e.preventDefault(); if (matches) mutation.mutate(); }}>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("admin.delete.title")}</h2>
          <p className={sheet.subtitle}>{i18n.t("admin.delete.warning")}</p>
        </header>

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="delete-confirm">
            {i18n.t("admin.delete.typeEmail", { email: user.username })}
          </label>
          <input id="delete-confirm" className={styles.select} type="email" dir="ltr"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            aria-describedby="delete-confirm-hint"
            value={typed}
            onChange={(e) => { setTyped(e.target.value); setError(null); }}
            onPaste={(e) => { e.preventDefault(); setError(i18n.t("admin.delete.noPaste")); }}
            onDrop={(e) => e.preventDefault()} />
          <p id="delete-confirm-hint" className={sheet.hint}>{i18n.t("admin.delete.typeHint")}</p>
        </div>

        {error && <p className={sheet.error} role="alert">{error}</p>}

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button variant="delete" type="submit" disabled={!matches || mutation.isPending}
            text={mutation.isPending ? i18n.t("buttons.processing") : i18n.t("admin.delete.confirm")} />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserModal;
