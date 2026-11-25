import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCurrency, getAdminCurrencies, orderCurrencies, updateCurrency } from "../../api/admin/adminService";
import SearchInput from "../../components/inputs/SearchInput";
import Button from "../../components/btns/Button";
import CurrencyFlag from "../../components/currencies/CurrencyFlag";
import { currencyName, moveCode, searchCurrencies } from "../../utils/currencies/currencyNames";
import styles from "../../styles/components/admin/admin.module.scss";
import page from "../../styles/pages/admin/adminCurrencies.module.scss";
import i18n from "../../configuration/i18n";

const backendMessage = (err) =>
  (typeof err?.response?.data === "string" && err.response.data)
  || err?.response?.data?.message
  || i18n.t("admin.saveError");

// One currency of the list: its two switches and its place.
const CurrencyRow = ({ currency, isFirst, isLast, onChange, onMove, busy }) => (
  <li className={`${styles.card} ${page.row}`} data-off={!currency.enabled && !currency.payment}>
    <span className={styles.userName}>
      <strong><CurrencyFlag code={currency.code} />{currency.code}</strong>
      <span className={styles.muted}>{currencyName(currency.code, i18n.language)}</span>
    </span>
    <label className={page.switch}>
      <input type="checkbox" checked={currency.enabled} disabled={busy}
        onChange={(e) => onChange(currency.code, { enabled: e.target.checked })} />
      {i18n.t("admin.currencies.forAccounts")}
    </label>
    <label className={page.switch}>
      <input type="checkbox" checked={currency.payment} disabled={busy}
        onChange={(e) => onChange(currency.code, { payment: e.target.checked })} />
      {i18n.t("admin.currencies.forPayments")}
    </label>
    <span className={page.move}>
      <button type="button" className={page.moveButton} disabled={busy || isFirst}
        aria-label={i18n.t("admin.currencies.moveUp", { code: currency.code })}
        onClick={() => onMove(currency.code, -1)}>↑</button>
      <button type="button" className={page.moveButton} disabled={busy || isLast}
        aria-label={i18n.t("admin.currencies.moveDown", { code: currency.code })}
        onClick={() => onMove(currency.code, 1)}>↓</button>
    </span>
  </li>
);

// The admin's list of currencies, and a search over every currency to add one.
// Users see the change at once: the users' list ["currencies"] is refreshed after each save.
const AdminCurrenciesPage = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(null);

  const { data: currencies = [], isLoading, isError } = useQuery({
    queryKey: ["admin", "currencies"],
    queryFn: getAdminCurrencies,
  });

  const saved = (list) => {
    if (Array.isArray(list)) queryClient.setQueryData(["admin", "currencies"], list);
    else queryClient.invalidateQueries({ queryKey: ["admin", "currencies"] });
    queryClient.invalidateQueries({ queryKey: ["currencies"] });
    setError(null);
  };
  const failed = (err) => {
    setError(backendMessage(err));
    queryClient.invalidateQueries({ queryKey: ["admin", "currencies"] });
  };

  const add = useMutation({
    mutationFn: addCurrency,
    onSuccess: (currency) => { saved(); setAdded(currency.code); setQuery(""); },
    onError: failed,
  });
  const update = useMutation({
    mutationFn: ({ code, changes }) => updateCurrency(code, changes),
    onSuccess: () => saved(),
    onError: failed,
  });
  const order = useMutation({ mutationFn: orderCurrencies, onSuccess: saved, onError: failed });

  const busy = add.isPending || update.isPending || order.isPending;
  const codes = currencies.map((c) => c.code);
  const results = searchCurrencies(query, i18n.language, codes);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("admin.currencies.title")}</h2>
      <p className={styles.muted} style={{ margin: 0 }}>{i18n.t("admin.currencies.hint")}</p>

      {error && <p className={styles.danger} role="alert">{error}</p>}

      <section className={styles.card} aria-labelledby="currencies-list">
        <h3 id="currencies-list" className={styles.cardTitle}>{i18n.t("admin.currencies.list")}</h3>
        {isLoading ? (
          <p className={styles.muted}>{i18n.t("messages.loading")}</p>
        ) : isError ? (
          <p className={styles.danger} role="alert">{i18n.t("admin.loadError")}</p>
        ) : (
          <ul className={styles.list}>
            {currencies.map((c, i) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                isFirst={i === 0}
                isLast={i === currencies.length - 1}
                busy={busy}
                onChange={(code, changes) => update.mutate({ code, changes })}
                onMove={(code, step) => order.mutate(moveCode(codes, code, step))}
              />
            ))}
          </ul>
        )}
      </section>

      <section className={styles.card} aria-labelledby="currencies-add">
        <h3 id="currencies-add" className={styles.cardTitle}>{i18n.t("admin.currencies.add")}</h3>
        <div className={styles.search}>
          <SearchInput name="currency-search" value={query}
            placeholder={i18n.t("admin.currencies.searchPlaceholder")}
            onChange={(e) => { setQuery(e.target.value); setAdded(null); }} />
        </div>
        {added && <p className={styles.muted} role="status">{i18n.t("admin.currencies.added", { code: added })}</p>}
        {query.trim() && results.length === 0 && (
          <p className={styles.muted}>{i18n.t("admin.currencies.noResults")}</p>
        )}
        {results.length > 0 && (
          <ul className={styles.list}>
            {results.map((code) => (
              <li key={code} className={`${styles.card} ${page.result}`}>
                <span className={styles.userName}>
                  <strong><CurrencyFlag code={code} />{code}</strong>
                  <span className={styles.muted}>{currencyName(code, i18n.language)}</span>
                </span>
                <Button variant="secondary" text={i18n.t("admin.currencies.addButton")} disabled={busy}
                  onClick={() => add.mutate(code)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminCurrenciesPage;