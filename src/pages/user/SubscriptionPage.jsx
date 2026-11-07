import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { createPaymentRequest, getMyPaymentRequests, getMySubscription } from "../../api/subscriptionService";
import StatusBadge from "../../components/admin/StatusBadge";
import FormInput from "../../components/inputs/FormInput";
import Button from "../../components/btns/Button";
import {
  PAYMENT_CURRENCIES, SUPPORT_WHATSAPP, USER_PAYMENT_METHODS, toPaymentRequest, validatePaymentRequest, whatsappLink,
} from "../../utils/subscription/subscription";
import { formatMoney } from "../../utils/accounts/accountStatement";
import { dateFnsLocale, toCalendarDay } from "../../utils/dates";
import styles from "../../styles/components/admin/admin.module.scss";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

const emptyForm = () => ({ months: 1, method: "", amount: "", currency: "SYP", reference: "", note: "" });

// The user's subscription: state, how to pay, and "I have paid" for the admin to approve.
const SubscriptionPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const set = (changes) => { setForm((f) => ({ ...f, ...changes })); setError(null); setSent(false); };

  const { data: info } = useQuery({ queryKey: ["subscription"], queryFn: getMySubscription });
  const { data: requests = [] } = useQuery({ queryKey: ["subscription", "requests"], queryFn: getMyPaymentRequests });
  const hasPending = requests.some((r) => r.status === "PENDING");

  const mutation = useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", "requests"] });
      setForm(emptyForm());
      setSent(true);
    },
    onError: (err) => setError(
      err?.response?.status === 409 ? i18n.t("subscription.alreadyPending") : i18n.t("subscription.sendError"),
    ),
  });

  const submit = (e) => {
    e.preventDefault();
    const key = validatePaymentRequest(form);
    if (key) return setError(i18n.t(key));
    mutation.mutate(toPaymentRequest(form));
  };

  const locale = dateFnsLocale(i18n.language);
  const day = (value) => {
    const d = toCalendarDay(value);
    return d ? format(d, "d MMMM yyyy", { locale }) : "—";
  };
  const chat = whatsappLink(SUPPORT_WHATSAPP, i18n.t("subscription.whatsappMessage"));

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("subscription.title")}</h2>

      <section className={styles.card} aria-labelledby="sub-state">
        <div className={styles.cardHeader}>
          <h3 id="sub-state" className={styles.cardTitle}>{i18n.t("subscription.state")}</h3>
          {info && <StatusBadge status={info.status} />}
        </div>
        <p className={styles.endsAt}>{info?.endsAt ? day(info.endsAt) : i18n.t("subscription.noEndDate")}</p>
        {info?.endsAt && <span className={styles.muted}>{i18n.t("subscription.lastDay")}</span>}
      </section>

      <section className={styles.card} aria-labelledby="sub-how">
        <h3 id="sub-how" className={styles.cardTitle}>{i18n.t("subscription.howToPay")}</h3>
        <p className={styles.muted} style={{ whiteSpace: "pre-line", margin: 0 }}>{i18n.t("subscription.howToPayText")}</p>
        {chat && (
          <div className={styles.actions}>
            <a className={styles.whatsapp} href={chat} target="_blank" rel="noopener noreferrer">
              {i18n.t("subscription.renew")}
            </a>
          </div>
        )}
      </section>

      <section className={styles.card} aria-labelledby="sub-paid">
        <h3 id="sub-paid" className={styles.cardTitle}>{i18n.t("subscription.iPaid")}</h3>
        {hasPending ? (
          <p className={styles.muted}>{i18n.t("subscription.alreadyPending")}</p>
        ) : (
          <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div className={sheet.field}>
              <span className={sheet.label}>{i18n.t("subscription.paidFor")}</span>
              <div className={styles.actions}>
                {[1, 3, 6, 12].map((m) => (
                  <button key={m} type="button" className={styles.quick} aria-pressed={form.months === m}
                    onClick={() => set({ months: m })}>
                    {i18n.t("admin.months", { count: m })}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={sheet.field}>
                <label className={sheet.label} htmlFor="pay-method">{i18n.t("admin.method")}</label>
                <select id="pay-method" className={styles.select} value={form.method}
                  onChange={(e) => set({ method: e.target.value })}>
                  <option value="">{i18n.t("admin.chooseMethod")}</option>
                  {USER_PAYMENT_METHODS.map((m) => <option key={m} value={m}>{i18n.t(`admin.methods.${m}`)}</option>)}
                </select>
              </div>
              <FormInput label={i18n.t("admin.reference")} name="reference" type="text"
                value={form.reference} onChange={(e) => set({ reference: e.target.value })} />
              <FormInput label={i18n.t("admin.amount")} name="amount" type="number" min="0" step="any"
                value={form.amount} onChange={(e) => set({ amount: e.target.value })} />
              <div className={sheet.field}>
                <label className={sheet.label} htmlFor="pay-currency">{i18n.t("share.currency")}</label>
                <select id="pay-currency" className={styles.select} value={form.currency}
                  onChange={(e) => set({ currency: e.target.value })}>
                  {PAYMENT_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <FormInput label={i18n.t("admin.note")} name="note" type="text"
              value={form.note} onChange={(e) => set({ note: e.target.value })} />
            {error && <p className={sheet.error} role="alert">{error}</p>}
            {sent && <p className={styles.muted} role="status">{i18n.t("subscription.sent")}</p>}
            <div className={styles.actions}>
              <Button variant="primary" type="submit" disabled={mutation.isPending}
                text={mutation.isPending ? i18n.t("buttons.processing") : i18n.t("subscription.send")} />
            </div>
          </form>
        )}
      </section>

      {requests.length > 0 && (
        <section className={styles.card} aria-labelledby="sub-requests">
          <h3 id="sub-requests" className={styles.cardTitle}>{i18n.t("subscription.myRequests")}</h3>
          <ul className={styles.list}>
            {requests.map((r) => (
              <li key={r.id} className={styles.card} style={{ padding: "0.7rem 0.9rem" }}>
                <div className={styles.cardHeader}>
                  <span>
                    {format(new Date(r.createdAt), "d MMM yyyy", { locale })} · {i18n.t("admin.months", { count: r.months })}
                    {r.amount != null && ` · ${formatMoney(r.amount, i18n.language)} ${r.currency ?? ""}`}
                  </span>
                  <span className={styles.badge} data-status={r.status === "APPROVED" ? "ACTIVE" : r.status === "REJECTED" ? "EXPIRED" : "TRIAL"}>
                    {i18n.t(`subscription.requestStatus.${r.status}`)}
                  </span>
                </div>
                <span className={styles.muted}>{i18n.t(`admin.methods.${r.method}`)} · {r.reference}</span>
                {r.adminNote && <span className={styles.muted}>{r.adminNote}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SubscriptionPage;
