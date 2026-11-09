import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import DropDown from "../elements/DropDown";
import Button from "../btns/Button";
import { addAccountCurrency } from "../../api/accountService";
import { ACCOUNT_CURRENCIES } from "../../utils/accounts/accountForm";
import { currenciesToAdd } from "../../utils/accounts/pockets";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// A new currency in the account, with its opening balance. Rendered only while open.
// onAdded(currency): the page switches to the new currency.
const AddCurrencyModal = ({ onClose, account, onAdded }) => {
  const queryClient = useQueryClient();
  const options = currenciesToAdd(ACCOUNT_CURRENCIES, account);
  const [currency, setCurrency] = useState(options[0] ?? "");
  const [opening, setOpening] = useState("");
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: () => addAccountCurrency(account.id, currency, opening === "" ? 0 : Number(opening)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onAdded?.(currency);
      onClose();
    },
    onError: (err) => setError(
      err?.response?.status === 409 ? i18n.t("currencies.exists") : i18n.t("currencies.saveError"),
    ),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!currency) return setError(i18n.t("messages.currencyRequired"));
    if (opening !== "" && Number.isNaN(Number(opening))) return setError(i18n.t("createAccount.balanceInvalid"));
    mutation.mutate();
  };

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} onSubmit={submit} noValidate>
        <header className={sheet.header}>
          <h2 className={sheet.title}>{i18n.t("currencies.addTitle", { name: account.name })}</h2>
          <p className={sheet.subtitle}>{i18n.t("currencies.addHint")}</p>
        </header>

        {options.length === 0 ? (
          <p className={sheet.hint}>{i18n.t("currencies.allAdded")}</p>
        ) : (
          <>
            <DropDown label={i18n.t("createAccount.currency")} name="currency" list={options}
              value={currency} onChange={(e) => { setCurrency(e.target.value); setError(null); }} />
            <div className={sheet.field}>
              <label className={sheet.label} htmlFor="currency-opening">{i18n.t("createAccount.balance")}</label>
              <div className={sheet.money}>
                <input id="currency-opening" type="number" inputMode="decimal" step="0.01" placeholder="0"
                  value={opening} onChange={(e) => { setOpening(e.target.value); setError(null); }} />
                <span className={sheet.moneyCurrency}>{currency}</span>
              </div>
            </div>
          </>
        )}

        {error && <p className={sheet.error} role="alert">{error}</p>}

        <div className={sheet.actions}>
          <Button variant="cancel" type="button" text={i18n.t("buttons.cancel")} onClick={onClose} />
          <Button variant="primary" type="submit" disabled={mutation.isPending || options.length === 0}
            text={mutation.isPending ? i18n.t("buttons.processing") : i18n.t("currencies.add")} />
        </div>
      </form>
    </Modal>
  );
};

export default AddCurrencyModal;
