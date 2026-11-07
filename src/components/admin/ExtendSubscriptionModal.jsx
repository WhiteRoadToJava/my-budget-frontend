import React, { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import Datepicker from "../inputs/Datepicker";
import Button from "../btns/Button";
import { extendSubscription } from "../../api/subscriptionService";
import {
  PAYMENT_CURRENCIES, PAYMENT_METHODS, toExtendRequest, validateExtension,
} from "../../utils/subscription/subscription";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/admin/admin.module.scss";
import i18n from "../../configuration/i18n";

// Record a payment and extend: by months (from the current end, or today if it
// has ended) or until an exact date. Rendered only while open.
const ExtendSubscriptionModal = ({ onClose, userId, months: initialMonths }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    months: initialMonths ?? null,
    until: "",
    method: "",
    amount: "",
    currency: "SYP",
    reference: "",
    note: "",
  });
  const [error, setError] = useState(null);
  const set = (changes) => { setForm((f) => ({ ...f, ...changes })); setError(null); };

  const mutation = useMutation({
    mutationFn: (request) => extendSubscription(userId, request),
    onSuccess: (details) => {
      queryClient.setQueryData(["admin", "user", userId], details);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      onClose();
    },
    // the backend's sentence explains what is wrong (both months and date, past date...)
    onError: (err) => setError(typeof err?.response?.data === "string" ? err.response.data : i18n.t("admin.saveError")),
  });

  const submit = (e) => {
    e.preventDefault();
    const key = validateExtension(form, format(new Date(), "yyyy-MM-dd"));
    if (key) return setError(i18n.t(key));
    mutation.mutate(toExtendRequest(form));
  };

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} onSubmit={submit} noValidate>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("admin.extendTitle")}</h2>
          <p className={sheet.subtitle}>{i18n.t("admin.extendHint")}</p>
        </header>

        <div className={sheet.field}>
          <span className={sheet.label}>{i18n.t("admin.duration")}</span>
          <div className={styles.actions}>
            {[1, 3, 6, 12].map((m) => (
              <button key={m} type="button" className={styles.quick}
                aria-pressed={!form.until && form.months === m} onClick={() => set({ months: m, until: "" })}>
                {i18n.t("admin.months", { count: m })}
              </button>
            ))}
          </div>
          <span className={sheet.label}>{i18n.t("admin.orUntil")}</span>
          <Datepicker value={form.until} onChange={(d) => set({ until: d })} />
        </div>

        <div className={sheet.field}>
          <label className={sheet.label} htmlFor="extend-method">{i18n.t("admin.method")}</label>
          <select id="extend-method" className={styles.select} value={form.method}
            onChange={(e) => set({ method: e.target.value })}>
            <option value="">{i18n.t("admin.chooseMethod")}</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{i18n.t(`admin.methods.${m}`)}</option>
            ))}
          </select>
        </div>

        {form.method !== "FREE" && (
          <div className={styles.formGrid}>
            <FormInput label={i18n.t("admin.amount")} name="amount" type="number" min="0" step="any"
              value={form.amount} onChange={(e) => set({ amount: e.target.value })} />
            <div className={sheet.field}>
              <label className={sheet.label} htmlFor="extend-currency">{i18n.t("share.currency")}</label>
              <select id="extend-currency" className={styles.select} value={form.currency}
                onChange={(e) => set({ currency: e.target.value })}>
                {PAYMENT_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        <FormInput label={i18n.t("admin.reference")} name="reference" type="text"
          value={form.reference} onChange={(e) => set({ reference: e.target.value })} />
        <FormInput label={i18n.t("admin.note")} name="note" type="text"
          value={form.note} onChange={(e) => set({ note: e.target.value })} />

        {error && <p className={sheet.error} role="alert">{error}</p>}

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button variant="primary" type="submit" disabled={mutation.isPending}
            text={mutation.isPending ? i18n.t("buttons.processing") : i18n.t("admin.saveExtension")} />
        </div>
      </form>
    </Modal>
  );
};

export default ExtendSubscriptionModal;
