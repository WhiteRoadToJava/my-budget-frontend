import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import LabeledDropDown from "./LabeledDropDown";
import styles from "../../styles/components/debts/debtForm.module.scss";
import { addSchedule } from "../../api/scheduleService";
import { getAccounts } from "../../api/accountService";
import { debtErrorKey, usableAccounts } from "../../utils/debts/debtForms";
import {
  SCHEDULE_INTERVALS, emptyPaymentForm, formToScheduleRequest, validatePaymentForm,
} from "../../utils/debts/debtSchedules";
import i18n from "../../configuration/i18n";

// Creates a DEBT_PAYMENT schedule: a REPAYMENT is added automatically every period,
// never more than what is still owed; the last one stops the schedule.
// Rendered by the parent only while open, so every opening starts fresh.
const DebtPaymentFormModal = ({ onClose, debt }) => {
  const [form, setForm] = useState(() => emptyPaymentForm());
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const accounts = usableAccounts(accountsData?.accounts, debt.currency);
  const selectedAccount = accounts.find((a) => a.id === form.accountId);

  const mutation = useMutation({
    mutationFn: (request) => addSchedule(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      onClose();
    },
    onError: (err) => setError(i18n.t(debtErrorKey(err, "debts.errorSchedule"))),
  });

  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = validatePaymentForm(form);
    if (key) {
      setError(i18n.t(key));
      return;
    }
    mutation.mutate(formToScheduleRequest(form, debt));
  };

  return (
    <Modal isOpen onClose={onClose}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{i18n.t("debts.recurringPayment")}</h2>
        <p className={styles.hint}>{i18n.t("debts.recurringPaymentHint")}</p>
        <form onSubmit={handleSubmit} noValidate>
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
              <LabeledDropDown
                label={i18n.t("debts.interval")}
                name="interval"
                options={SCHEDULE_INTERVALS}
                value={form.interval}
                onChange={(v) => set("interval", v)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>{i18n.t("debts.firstPaymentDate")}</label>
            <Datepicker value={form.firstDate} onChange={(d) => set("firstDate", d)} />
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
            <label htmlFor="payment-description">{i18n.t("debts.description")}</label>
            <textarea
              id="payment-description"
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

export default DebtPaymentFormModal;
