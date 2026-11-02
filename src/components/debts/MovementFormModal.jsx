import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import LabeledDropDown from "./LabeledDropDown";
import styles from "../../styles/components/debts/debtForm.module.scss";
import { addDebtMovement } from "../../api/debtService";
import { getAccounts } from "../../api/accountService";
import { formatNumber } from "../../utils/formating";
import {
  MOVEMENT_TYPES, debtErrorKey, emptyMovementForm, formToMovementRequest,
  usableAccounts, validateMovementForm,
} from "../../utils/debts/debtForms";
import i18n from "../../configuration/i18n";

// Rendered by the parent only while open, so every opening starts fresh.
const MovementFormModal = ({ onClose, debt }) => {
  const [form, setForm] = useState(() => emptyMovementForm());
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const accounts = usableAccounts(accountsData?.accounts, debt.currency);
  const remaining = Number(debt.summary?.totalOwed ?? 0);
  const selectedAccount = accounts.find((a) => a.id === form.accountId);

  const mutation = useMutation({
    mutationFn: (request) => addDebtMovement(debt.id, request),
    onSuccess: (updated) => {
      // the movement changes the debt, the account balance and the transaction lists
      queryClient.setQueryData(["debts", debt.id], updated);
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
    },
    onError: (err) => setError(i18n.t(debtErrorKey(err, "debts.errorMovement"))),
  });

  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = validateMovementForm(form, { startDate: debt.startDate, remaining });
    if (key) {
      setError(i18n.t(key));
      return;
    }
    mutation.mutate(formToMovementRequest(form));
  };

  return (
    <Modal isOpen onClose={onClose}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{i18n.t("debts.addMovement")}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <LabeledDropDown
              label={i18n.t("debts.type")}
              name="movementType"
              options={MOVEMENT_TYPES}
              value={form.movementType}
              onChange={(v) => set("movementType", v)}
            />
          </div>
          {form.movementType === "REPAYMENT" && (
            <p className={styles.hint}>
              {i18n.t("debts.remainingHint", { amount: formatNumber(remaining), currency: debt.currency })}
            </p>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <FormInput
                label={`${i18n.t("debts.amount")} (${debt.currency})`}
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>{i18n.t("debts.date")}</label>
              <Datepicker value={form.date} onChange={(d) => set("date", d)} />
            </div>
          </div>

          <div className={styles.field}>
            <DropDown
              label={i18n.t("debts.account")}
              name="accountId"
              list={accounts.map((a) => a.name)}
              value={selectedAccount?.name || ""}
              onChange={(e) => set("accountId", accounts.find((a) => a.name === e.target.value)?.id || "")}
            />
          </div>
          {accounts.length === 0 && (
            <p className={styles.hint}>{i18n.t("debts.noAccountInCurrency", { currency: debt.currency })}</p>
          )}

          <div className={styles.field}>
            <label htmlFor="movement-description">{i18n.t("debts.description")}</label>
            <textarea
              id="movement-description"
              className={styles.textarea}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <div className={styles.buttonContainer}>
            <Button variant="cancel" text={i18n.t("buttons.cancel")} onClick={onClose} type="button" />
            <Button
              type="submit"
              text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.save")}
              disabled={mutation.isPending}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MovementFormModal;
