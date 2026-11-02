import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import LabeledDropDown from "./LabeledDropDown";
import styles from "../../styles/components/debts/debtForm.module.scss";
import { addDebt, updateDebt } from "../../api/debtService";
import { CURRENCIES } from "../../utils/currencies";
import {
  COMPOUNDINGS, DIRECTIONS, debtErrorKey, debtToForm, emptyDebtForm,
  formToDebtRequest, validateDebtForm,
} from "../../utils/debts/debtForms";
import i18n from "../../configuration/i18n";

// Create (no debt) or edit (debt given). After movements exist the backend
// refuses to change direction and currency, so those fields are locked.
// The parent renders this only while open, so the form starts fresh each time.
const DebtFormModal = ({ onClose, debt, hasMovements = false, onSaved }) => {
  const isEdit = !!debt;
  const [form, setForm] = useState(() => (isEdit ? debtToForm(debt) : emptyDebtForm()));
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request) => (isEdit ? updateDebt(debt.id, request) : addDebt(request)),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      onSaved?.(saved);
      onClose();
    },
    onError: (err) => setError(i18n.t(debtErrorKey(err, "debts.errorSave"))),
  });

  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };
  const onInput = (e) => set(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = validateDebtForm(form);
    if (key) {
      setError(i18n.t(key));
      return;
    }
    mutation.mutate(formToDebtRequest(form));
  };

  const locked = isEdit && hasMovements;

  return (
    <Modal isOpen onClose={onClose}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{i18n.t(isEdit ? "debts.editDebt" : "debts.addDebt")}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <FormInput label={i18n.t("debts.name")} name="name" value={form.name} onChange={onInput} />
          </div>
          <div className={styles.field}>
            <FormInput
              label={i18n.t("debts.counterparty")}
              name="counterparty"
              value={form.counterparty}
              onChange={onInput}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <LabeledDropDown
                label={i18n.t("debts.direction")}
                name="direction"
                options={DIRECTIONS}
                value={form.direction}
                onChange={(v) => set("direction", v)}
                disabled={locked}
              />
            </div>
            <div className={styles.field}>
              {locked ? (
                <FormInput label={i18n.t("debts.currency")} name="currency" value={form.currency} disabled readOnly />
              ) : (
                <DropDown
                  label={i18n.t("debts.currency")}
                  name="currency"
                  list={CURRENCIES}
                  value={form.currency}
                  onChange={onInput}
                />
              )}
            </div>
          </div>
          {locked && <p className={styles.hint}>{i18n.t("debts.lockedHint")}</p>}

          <div className={styles.row}>
            <div className={styles.field}>
              <FormInput
                label={i18n.t("debts.annualRate")}
                name="annualRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.annualRate}
                onChange={onInput}
              />
            </div>
            <div className={styles.field}>
              <LabeledDropDown
                label={i18n.t("debts.compounding")}
                name="compounding"
                options={COMPOUNDINGS}
                value={form.compounding}
                onChange={(v) => set("compounding", v)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>{i18n.t("debts.startDate")}</label>
            <Datepicker value={form.startDate} onChange={(d) => set("startDate", d)} />
          </div>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.countInflowsAsIncome}
              onChange={(e) => set("countInflowsAsIncome", e.target.checked)}
            />
            {i18n.t("debts.countInflowsAsIncome")}
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.countOutflowsAsExpense}
              onChange={(e) => set("countOutflowsAsExpense", e.target.checked)}
            />
            {i18n.t("debts.countOutflowsAsExpense")}
          </label>

          <div className={styles.field}>
            <label htmlFor="debt-note">{i18n.t("debts.note")}</label>
            <textarea id="debt-note" name="note" className={styles.textarea} value={form.note} onChange={onInput} />
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

export default DebtFormModal;
