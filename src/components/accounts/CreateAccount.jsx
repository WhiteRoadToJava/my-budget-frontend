import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import { addAccount, getAccounts } from "../../api/accountService";
import {
  ACCOUNT_CURRENCIES, ACCOUNT_TYPES, accountErrorKey, emptyAccountForm,
  formToAccountRequest, validateAccountForm,
} from "../../utils/accounts/accountForm";
import styles from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// The form lives in its own component and is rendered only while open,
// so every opening starts empty without resetting state by hand.
const CreateAccountForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const existing = accountsData?.accounts ?? [];

  const [form, setForm] = useState(() => emptyAccountForm(existing));
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: (err) => setError(i18n.t(accountErrorKey(err))),
  });

  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = validateAccountForm(form, existing);
    if (key) {
      setError(i18n.t(key));
      return;
    }
    mutation.mutate(formToAccountRequest(form));
  };

  return (
    <Modal isOpen onClose={onClose} className={styles.sheet}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <header className={styles.header}>
          <h2 className={styles.title}>{i18n.t("createAccount.title")}</h2>
          <p className={styles.subtitle}>{i18n.t("createAccount.subtitle")}</p>
        </header>

        <FormInput
          label={i18n.t("createAccount.name")}
          placeholder={i18n.t("createAccount.namePlaceholder")}
          name="name"
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          autoFocus
        />

        <fieldset className={styles.choices}>
          <legend>{i18n.t("createAccount.type")}</legend>
          {ACCOUNT_TYPES.map((t) => (
            <label key={t.value} className={styles.choice}>
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={form.type === t.value}
                onChange={() => set("type", t.value)}
              />
              <span className={styles.choiceTitle}>{i18n.t(t.label)}</span>
              <span className={styles.choiceHint}>{i18n.t(t.hint)}</span>
            </label>
          ))}
        </fieldset>

        <DropDown
          label={i18n.t("createAccount.currency")}
          name="currency"
          value={form.currency}
          onChange={(e) => set("currency", e.target.value)}
          list={ACCOUNT_CURRENCIES}
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="account-balance">
            {i18n.t("createAccount.balance")}
          </label>
          <div className={styles.money}>
            <input
              id="account-balance"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0"
              value={form.balance}
              onChange={(e) => set("balance", e.target.value)}
              aria-describedby="account-balance-hint"
            />
            <span className={styles.moneyCurrency}>{form.currency}</span>
          </div>
          <p id="account-balance-hint" className={styles.hint}>
            {i18n.t("createAccount.balanceHint")}
          </p>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button
            variant="primary"
            type="submit"
            text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.addAccount")}
            disabled={mutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

// isOpen / isClose: same props as before, so the callers do not change
const CreateAccount = ({ isOpen, isClose }) =>
  isOpen ? <CreateAccountForm onClose={isClose} /> : null;

export default CreateAccount;
