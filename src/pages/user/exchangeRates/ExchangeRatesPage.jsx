import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addExchangeRate,
  deleteExchangeRate,
  getExchangeRates,
} from "../../../api/exchangeRateService";
import { ACCOUNT_CURRENCIES } from "../../../utils/accounts/accountForm";
import { formatRate } from "../../../utils/transactions/exchangeRate";
import Button from "../../../components/btns/Button";
import i18n from "../../../configuration/i18n";
import page from "../../../styles/components/debts/debts.module.scss";
import styles from "../../../styles/pages/exchangeRates.module.scss";

const emptyForm = { from: "", to: "", rate: "" };

// The user's own rate table: the last rate of each currency pair. Transfers between two
// currencies update it on their own; a rate can also be added or deleted here.
const ExchangeRatesPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const {
    data: rates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: getExchangeRates,
  });

  // the transfer form keeps one lookup per pair: drop them all after a change
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
    queryClient.removeQueries({ queryKey: ["exchangeRate"] });
  };

  const addMutation = useMutation({
    mutationFn: addExchangeRate,
    onSuccess: () => {
      refresh();
      setForm(emptyForm);
    },
    onError: () => setError(i18n.t("exchangeRates.saveError")),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteExchangeRate,
    onSuccess: refresh,
    onError: () => setError(i18n.t("exchangeRates.deleteError")),
  });

  const change = (field) => (e) => {
    const value =
      field === "rate"
        ? e.target.value
        : e.target.value.toUpperCase().slice(0, 3);
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = /^[A-Z]{3}$/;
    if (!code.test(form.from) || !code.test(form.to))
      return setError(i18n.t("exchangeRates.codeError"));
    if (form.from === form.to)
      return setError(i18n.t("exchangeRates.sameError"));
    if (!(Number(form.rate) > 0))
      return setError(i18n.t("exchangeRates.rateError"));
    addMutation.mutate({
      from: form.from,
      to: form.to,
      rate: Number(form.rate),
    });
  };

  if (isLoading)
    return <div className={page.page}>{i18n.t("exchangeRates.loading")}</div>;
  if (isError)
    return <div className={page.page}>{i18n.t("exchangeRates.loadError")}</div>;

  return (
    <div className={page.page}>
      <div className={page.pageHeader}>
        <h2 className={page.title}>{i18n.t("exchangeRates.title")}</h2>
      </div>
      <p className={styles.muted}>{i18n.t("exchangeRates.hint")}</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label>
          {i18n.t("exchangeRates.from")}
          <input
            list="rate-currencies"
            value={form.from}
            onChange={change("from")}
            placeholder="USD"
          />
        </label>
        <label>
          {i18n.t("exchangeRates.to")}
          <input
            list="rate-currencies"
            value={form.to}
            onChange={change("to")}
            placeholder="SYP"
          />
        </label>
        <label>
          {form.from && form.to
            ? `${i18n.t("exchangeRates.rate")} (1 ${form.from} = ? ${form.to})`
            : i18n.t("exchangeRates.rate")}
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={form.rate}
            onChange={change("rate")}
          />
        </label>
        <Button
          type="submit"
          text={
            addMutation.isPending
              ? i18n.t("buttons.processing")
              : i18n.t("exchangeRates.add")
          }
          disabled={addMutation.isPending}
        />
        <datalist id="rate-currencies">
          {ACCOUNT_CURRENCIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </form>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {rates.length === 0 ? (
        <p className={page.empty}>{i18n.t("exchangeRates.empty")}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{i18n.t("exchangeRates.pair")}</th>
              <th>{i18n.t("exchangeRates.rate")}</th>
              <th>{i18n.t("exchangeRates.inverse")}</th>
              <th>{i18n.t("exchangeRates.updatedAt")}</th>
              <th>{i18n.t("exchangeRates.source")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.from} → {r.to}
                </td>
                <td>
                  1 {r.from} = {formatRate(r.rate)} {r.to}
                </td>
                <td className={styles.muted}>
                  1 {r.to} = {formatRate(1 / r.rate)} {r.from}
                </td>
                <td className={styles.muted}>
                  {String(r.updatedAt ?? "").slice(0, 10)}
                </td>
                <td className={styles.muted}>
                  {r.transferNumber
                    ? `${i18n.t("exchangeRates.fromTransfer")} #${r.transferNumber}`
                    : i18n.t("exchangeRates.manual")}
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.delete}
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(r.id)}
                  >
                    {i18n.t("buttons.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExchangeRatesPage;
