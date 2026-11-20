import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import SearchableDropDown from "../elements/SearchableDropDown.jsx";
import Button from "../btns/Button";
import { ImagePicker } from "../ImagePicker.jsx";
import TransferFeesFields, { TransferFeeField } from "./TransferFeesFields";
import TransferSummary from "./TransferSummary";
import { createTransfer } from "../../api/transferServce.js";
import {
  emptyFees,
  feesToRequest,
  validateFees,
} from "../../utils/transactions/transferFees";
import CurrencySelect from "../inputs/CurrencySelect";
import AmountWithCurrency from "../inputs/AmountWithCurrency";
import {
  firstCurrency,
  hasCurrency,
  pocketOf,
  pocketsOf,
} from "../../utils/accounts/pockets";
import { formatNumber } from "../../utils/formating";
import { useIsPhone } from '../../hooks/useIsPhone.js'
import sheet from "../../styles/components/forms/formSheet.module.scss";
import styles from "../../styles/components/transfers/transferForm.module.scss";
import i18n from "../../configuration/i18n.js";
import { getLatestRate } from "../../api/exchangeRateService.js";
import {
  formatRate,
  sentFromReceived,
} from "../../utils/transactions/exchangeRate.js";
import { createdAtFor, isFutureDay, todayString } from "../../utils/transactions/transactionDate.js";
import TransactionDateField from "../inputs/TransactionDateField.jsx";


const emptyTransfer = (sourceId = "", sourceCurrency = "") => ({
  sourceAccount: { id: sourceId },
  sourceCurrency,
  destinationAccount: { id: "" },
  destinationCurrency: "",
  amountSent: "",
  exChangeRate: 1,
  amountReceived: "",
  description: "",
});

const hasAnyFee = (fees) =>
  Number(fees.sendFee) > 0 || Number(fees.receiveFee) > 0;

const currenciesOf = (account) => pocketsOf(account).map((p) => p.currency);

// the receiving currency when an account is chosen: the sent currency when the account
// has it (and it is another account), else another currency of it
const defaultReceived = (account, sentCurrency, sameAccount) => {
  const codes = currenciesOf(account);
  if (!sameAccount && hasCurrency(account, sentCurrency)) return sentCurrency;
  return codes.find((c) => c !== sentCurrency) ?? codes[0] ?? "";
};

// The form lives in its own component and is rendered only while open,
// so every opening starts from the props (current account or duplicate).
// currentCurrency: the currency tab the transfer was started from
const TransferForm = ({
  onClose,
  accounts,
  currentAccount,
  currentCurrency,
  initialData,
}) => {
  const queryClient = useQueryClient();
  const isPhone = useIsPhone();
  const accountsList = accounts?.accounts || [];

  // a duplicate brings its fees separately from the transfer fields
  const { fees: initialFees, ...initialTransfer } = initialData ?? {};
  const [transferData, setTransferData] = useState(() => ({
    ...emptyTransfer(
      currentAccount?.id ?? "",
      currentCurrency || firstCurrency(currentAccount),
    ),
    ...initialTransfer,
  }));
  const [fees, setFees] = useState(() => initialFees ?? emptyFees());
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(todayString);
  const [error, setError] = useState(null);
  const [savedRate, setSavedRate] = useState(null);

  const accountById = (id) => accountsList.find((a) => a.id === id);
  const source = accountById(transferData.sourceAccount.id);
  const destination = accountById(transferData.destinationAccount.id);
  // the currency of each side (a duplicated or old transfer may have none: the account's first)
  const sourceCurrency = transferData.sourceCurrency || firstCurrency(source);
  const destinationCurrency =
    transferData.destinationCurrency || firstCurrency(destination);
  const sameAccount = Boolean(
    source && destination && source.id === destination.id,
  );
  const exchange = sameAccount && sourceCurrency !== destinationCurrency;
  // one currency: the rate is 1 and what arrives is what was sent
  const sameCurrency =
    !source || !destination || sourceCurrency === destinationCurrency;
  const available = pocketOf(source, sourceCurrency)?.totalBalance;

  const set = (changes) => {
    setTransferData((prev) => ({ ...prev, ...changes }));
    setError(null);
  };

  // same currency on both sides: no rate, what arrives is what was sent
  const sameCurrencyChanges = (from, to) =>
    from === to
      ? { exChangeRate: 1, amountReceived: transferData.amountSent }
      : {};

  const loadRate = async (from, to) => {
    setSavedRate(null);
    if (!from || !to || from === to) return;
    let found = null;
    try {
      found = await queryClient.fetchQuery({
        queryKey: ["exchangeRate", from, to],
        queryFn: () => getLatestRate(from, to),
        staleTime: 60_000,
      });
    } catch {
      return;
    }
    if (!found) return;
    const rate = Number(formatRate(found.rate));
    setSavedRate({ ...found, rate });
    setTransferData((prev) => {
      if (prev.sourceCurrency !== from || prev.destinationCurrency !== to)
        return prev;
      if (Number(prev.amountSent) > 0) {
        return {
          ...prev,
          exChangeRate: rate,
          amountReceived: Number(prev.amountSent) * rate,
        };
      }
      if (Number(prev.amountReceived) > 0) {
        return {
          ...prev,
          exChangeRate: rate,
          amountSent: sentFromReceived(prev.amountReceived, rate),
        };
      }
      return { ...prev, exChangeRate: rate };
    });
  };

  const chooseAccount = (side, name) => {
    const account = accountsList.find((a) => a.name === name);
    if (side === "sourceAccount") {
      const currency = firstCurrency(account);
      set({
        sourceAccount: { id: account?.id ?? "" },
        sourceCurrency: currency,
        destinationCurrency: destination ? destinationCurrency : "",
        ...sameCurrencyChanges(currency, destinationCurrency),
      });
      setFees((f) => ({ ...f, sendFeeCurrency: "" }));
      if (destination) loadRate(currency, destinationCurrency);
    } else {
      const currency = defaultReceived(
        account,
        sourceCurrency,
        account?.id === source?.id,
      );
      set({
        destinationAccount: { id: account?.id ?? "" },
        destinationCurrency: currency,
        sourceCurrency,
        ...sameCurrencyChanges(sourceCurrency, currency),
      });
      setFees((f) => ({ ...f, receiveFeeCurrency: "" }));
      if (source) loadRate(sourceCurrency, currency);
    }
  };

  const chooseCurrency = (side, code) => {
    if (side === "source") {
      set({
        sourceCurrency: code,
        destinationCurrency,
        ...sameCurrencyChanges(code, destinationCurrency),
      });
      if (destination) loadRate(code, destinationCurrency);
    } else {
      set({
        destinationCurrency: code,
        sourceCurrency,
        ...sameCurrencyChanges(sourceCurrency, code),
      });
      loadRate(sourceCurrency, code);
    }
  };

  // the button: keep the received amount and the rate, work out what has to be sent
  const canComputeSent =
    !sameCurrency &&
    Number(transferData.amountReceived) > 0 &&
    Number(transferData.exChangeRate) > 0;
  const computeSent = () =>
    set({
      amountSent: sentFromReceived(
        transferData.amountReceived,
        transferData.exChangeRate,
      ),
    });

  // keep sent, rate and received consistent whichever one the user edits
  const changeSent = (value) =>
    set({
      amountSent: value,
      amountReceived:
        value === ""
          ? ""
          : Number(value) * Number(transferData.exChangeRate || 1),
    });
  const changeRate = (value) =>
    set({
      exChangeRate: value,
      amountReceived: Number(transferData.amountSent || 0) * Number(value || 0),
    });
  const changeReceived = (value) =>
    set({
      amountReceived: value,
      exChangeRate: Number(transferData.amountSent)
        ? Number(value) / Number(transferData.amountSent)
        : transferData.exChangeRate,
    });

  const mutation = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: () => setError(i18n.t("messages.errorCreateTransfer")),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transferData.sourceAccount.id || !transferData.destinationAccount.id) {
      return setError(i18n.t("messages.accountRequired"));
    }
    // the same account is fine in two currencies (an exchange), not twice the same currency
    if (sameAccount && sourceCurrency === destinationCurrency) {
      return setError(i18n.t("currencies.samePocket"));
    }
    if (!(Number(transferData.amountSent) > 0)) {
      return setError(i18n.t("messages.amountless"));
    }
    const feeError = validateFees(fees);
    if (feeError) return setError(i18n.t(feeError));

    if(isFutureDay(date)) return setError(i18n.t("transactionDate.future"));
    mutation.mutate({
      ...transferData,
      sourceCurrency,
      destinationCurrency,
      amountSent: Number(transferData.amountSent),
      exChangeRate: Number(transferData.exChangeRate),
      amountReceived: Number(transferData.amountReceived),
      category: "transfer",
      image,
      createdAt: createTransfer(date),
      ...feesToRequest(fees, { sourceCurrency, destinationCurrency }),
    });
  };

  // every account once; the same account on both sides is an exchange between its currencies
  const names = () => accountsList.map((a) => a.name);

  // the parts of the form; a phone shows each side under the other (account, amount, fee),
  // a computer keeps the accounts on one row and the fees together
  const sourceField = (
    <SearchableDropDown
      label={i18n.t("createTransfer.sourceAccount")}
      placeholder={i18n.t("placeholder.sourceAccount")}
      list={names()}
      name="sourceAccount"
      value={source?.name ?? ""}
      onChange={(e) => chooseAccount("sourceAccount", e.target.value)}
      searchPlaceholder={i18n.t("dropDown.searchAccount")}
    />
  );

  const destinationField = (
    <SearchableDropDown
      label={i18n.t("createTransfer.destinationAccount")}
      placeholder={i18n.t("placeholder.destinationAccount")}
      list={names()}
      name="destinationAccount"
      value={destination?.name ?? ""}
      onChange={(e) => chooseAccount("destinationAccount", e.target.value)}
      searchPlaceholder={i18n.t("dropDown.searchAccount")}
    />
  );

  const sentField = (
    <div className={sheet.field}>
      <label className={sheet.label} htmlFor="transfer-sent">
        {i18n.t("createTransfer.amountSent")}
      </label>
      <div className={sheet.money}>
        <input
          id="transfer-sent"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0"
          value={transferData.amountSent}
          onChange={(e) => changeSent(e.target.value)}
        />
        <CurrencySelect
          currencies={currenciesOf(source)}
          value={sourceCurrency}
          label={i18n.t("createTransfer.amountSent")}
          onChange={(code) => chooseCurrency("source", code)}
        />
      </div>
      {available !== undefined && (
        <p className={sheet.available}>
          {i18n.t("currencies.available")}: {formatNumber(Number(available))}{" "}
          {sourceCurrency}
        </p>
      )}
    </div>
  );

  // what arrives, in a currency of the receiving account
  const receivedField = destination && (
    <AmountWithCurrency
      label={i18n.t("createTransfer.amountReceived")}
      name="amountReceived"
      value={
        sameCurrency ? transferData.amountSent : transferData.amountReceived
      }
      onChange={(e) => changeReceived(e.target.value)}
      readOnly={sameCurrency}
      account={destination}
      currency={destinationCurrency}
      onCurrencyChange={(code) => chooseCurrency("destination", code)}
      showAvailable={false}
    />
  );

  const feeProps = { fees, onChange: setFees, accounts: accountsList };

  return (
    <Modal isOpen onClose={onClose} className={sheet.sheet}>
      <form className={sheet.form} onSubmit={handleSubmit} noValidate>
        <header className={sheet.header}>
          <h2 className={sheet.title}>
            {i18n.t(
              exchange ? "currencies.exchangeTitle" : "createTransfer.title",
            )}
          </h2>
        </header>
        {isPhone ? (
          <>
            <section className={styles.side}>
              {sourceField}
              {sentField}
              {source && (
                <TransferFeeField
                  side="send"
                  account={source}
                  currency={sourceCurrency}
                  {...feeProps}
                />
              )}
            </section>

            <section className={styles.side}>
              {destinationField}
              {receivedField}
              {destination && (
                <TransferFeeField
                  side="receive"
                  account={destination}
                  currency={destinationCurrency}
                  {...feeProps}
                />
              )}
            </section>
          </>
        ) : (
          <>
            <div className={styles.route}>
              {sourceField}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              {destinationField}
            </div>
            {sentField}
            {receivedField}
          </>
        )}
        {canComputeSent && (
          <button
            type="button"
            className={styles.computeSent}
            onClick={computeSent}
          >
            {i18n.t("exchangeRates.computeSent")}
          </button>
        )}

        {!sameCurrency && (
          <FormInput
            label={`${i18n.t("createTransfer.exchangeRate")} (1 ${sourceCurrency} = ? ${destinationCurrency})`}
            name="exChangeRate"
            type="number"
            step="any"
            value={transferData.exChangeRate}
            onChange={(e) => changeRate(e.target.value)}
          />
        )}
        {!sameCurrency && savedRate && (
          <p className={sheet.available}>
            {i18n.t("exchangeRates.lastUsed")}: 1 {savedRate.from} ={" "}
            {formatRate(savedRate.rate)} {savedRate.to}
            {" · "}
            {String(savedRate.updatedAt ?? "").slice(0, 10)}
          </p>
        )}
        {!isPhone && (
          <details className={styles.fees} open={hasAnyFee(fees)}>
            <summary>{i18n.t("transferFees.title")}</summary>
            <div>
              <TransferFeesFields
                fees={fees}
                onChange={setFees}
                accounts={accountsList}
                sourceAccount={source}
                sourceCurrency={sourceCurrency}
                destinationAccount={destination}
                destinationCurrency={destinationCurrency}
              />
            </div>
          </details>
        )}

        <TransferSummary
          sourceId={transferData.sourceAccount.id}
          sourceCurrency={sourceCurrency}
          destinationId={transferData.destinationAccount.id}
          destinationCurrency={destinationCurrency}
          amountSent={transferData.amountSent}
          amountReceived={transferData.amountReceived}
          fees={fees}
          accounts={accountsList}
        />

        <TransactionDateField
          className={sheet.field}
          labelClassName={sheet.label}
          value={date}
          onChange={setDate}
        />
        <FormInput
          label={i18n.t("createTransfer.description")}
          name="description"
          type="text"
          value={transferData.description || ""}
          onChange={(e) => set({ description: e.target.value })}
        />
        <ImagePicker onImageChange={setImage} />

        {error && (
          <p className={sheet.error} role="alert">
            {error}
          </p>
        )}

        <div className={sheet.actions}>
          <Button
            variant="cancel"
            text={i18n.t("buttons.cancel")}
            onClick={onClose}
            type="button"
          />
          <Button
            variant="primary"
            type="submit"
            text={
              mutation.isPending
                ? i18n.t("buttons.processing")
                : i18n.t("buttons.createTransfer")
            }
            disabled={mutation.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};

// isOpen / isClose: same props as before, so the callers do not change
const CreateTransfer = ({
  isOpen,
  isClose,
  accounts,
  currentAccount,
  currentCurrency,
  initialData,
}) =>
  isOpen ? (
    <TransferForm
      onClose={isClose}
      accounts={accounts}
      currentAccount={currentAccount}
      currentCurrency={currentCurrency}
      initialData={initialData}
    />
  ) : null;

export default CreateTransfer;
