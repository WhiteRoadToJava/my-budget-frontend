import React, { useState } from "react";
import Modal from "../modals/Modal";
import FormInput from "../inputs/FormInput";
import DropDown from "../elements/DropDown";
import AmountWithCurrency from "../inputs/AmountWithCurrency";
import { firstCurrency, hasCurrency, pocketsOf } from "../../utils/accounts/pockets";
import CurrencySelect from "../inputs/CurrencySelect";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import Button from "../btns/Button";
import styles from "../../styles/components/schedule/createdScheduledTransfer.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSchedule } from "../../api/scheduleService";
import Datepicker from "../inputs/Datepicker";
import i18n from "../../configuration/i18n";

const interval = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

const CreateScheduledTransfer = ({ isOpen, isClose, accounts }) => {
  const [transferData, setTransferData] = useState({
    name: "",
    description: "",
    sourceAccountId: "",
    destinationAccountId: "",
    transactionTypes: ["TRANSFER"],
    category: "transfer",
    amountSend: 0,
    exChangeRate: 1,
    nextExecutionDate: "",
    scheduleIntervals: [],
    isActive: true,
  });
  const [error, setError] = useState({ hasError: false, message: "" });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      cleanData();
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("messages.amountless"),
      });
    },
  });

  const accountsList = accounts?.accounts || [];

  const getAccountNameById = (id) => accountsList.find((acc) => acc.id === id)?.name;
  const selectedSourceName = getAccountNameById(transferData.sourceAccountId);
  const selectedDestinationName = getAccountNameById(transferData.destinationAccountId);
  const sourceAccount = accountsList.find((a) => a.id === transferData.sourceAccountId);
  const destinationAccount = accountsList.find((a) => a.id === transferData.destinationAccountId);
  const sourceCurrency = transferData.sourceCurrency || firstCurrency(sourceAccount);
  const destinationCurrency = transferData.destinationCurrency || firstCurrency(destinationAccount);
  const sameAccount = Boolean(sourceAccount && destinationAccount && sourceAccount.id === destinationAccount.id);
  const sameCurrency = !sourceAccount || !destinationAccount || sourceCurrency === destinationCurrency;
  const currenciesOf = (account) => pocketsOf(account).map((p) => p.currency);

  // every account once; the same account on both sides is an exchange between its currencies
  const filteredSourceList = accountsList.map((acc) => acc.name);
  const filteredDestinationList = accountsList.map((acc) => acc.name);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
    setError({ hasError: false, message: "" });
  };

  const handleAccountChange = (field) => (e) => {
    const selectedName = e.target.value;
    const selectedAccount = accountsList.find((acc) => acc.name === selectedName);
    setTransferData((prev) => {
      const next = { ...prev, [field]: selectedAccount?.id || "" };
      if (field === "sourceAccountId") {
        next.sourceCurrency = firstCurrency(selectedAccount);
      } else {
        // the sent currency when the account has it (and it is another account), else another one
        const codes = currenciesOf(selectedAccount);
        const same = selectedAccount?.id === prev.sourceAccountId;
        next.destinationCurrency = !same && hasCurrency(selectedAccount, sourceCurrency)
          ? sourceCurrency
          : codes.find((c) => c !== sourceCurrency) ?? codes[0] ?? "";
      }
      return next;
    });
    setError({ hasError: false, message: "" });
  };

  const handleValidation = () => {
    if (!transferData.amountSend || parseFloat(transferData.amountSend) <= 0) {
      setError({ hasError: true, message: i18n.t("messages.amountless") });
      return false;
    }
    if (!transferData.sourceAccountId || !transferData.destinationAccountId) {
      setError({ hasError: true, message: i18n.t("messages.accountRequired") });
      return false;
    }
    if (sameAccount && sameCurrency) {
      setError({ hasError: true, message: i18n.t("currencies.samePocket") });
      return false;
    }
    if (!sameCurrency && !(Number(transferData.exChangeRate) > 0)) {
      setError({ hasError: true, message: i18n.t("currencies.rateRequired") });
      return false;
    }
    return true;
  };

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    const rate = sameCurrency ? 1 : Number(transferData.exChangeRate);
    mutation.mutate({
      ...transferData,
      sourceCurrency,
      destinationCurrency,
      exChangeRate: rate,
      amountReceived: Number(transferData.amountSend) * rate,
    });
  };

  const cleanData = () => {
    isClose();
    setError({ hasError: false, message: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={cleanData} className={styles.formContainer}>
      <h2 className={styles.title}>{i18n.t("buttons.createTransfer")}</h2>
      <form onSubmit={handleCreateTransfer}>
        <div className={styles.inputContainer}>
          <FormInput
            label={i18n.t("createSchedule.name")}
            name="name"
            type="text"
            value={transferData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.sourceAccount")}
            placeholder={i18n.t("placeholder.sourceAccount")}
            list={filteredSourceList}
            name="sourceAccountId"
            value={selectedSourceName || ""}
            onChange={handleAccountChange("sourceAccountId")}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.destinationAccount")}
            placeholder={i18n.t("placeholder.destinationAccount")}
            list={filteredDestinationList}
            name="destinationAccountId"
            value={selectedDestinationName || ""}
            onChange={handleAccountChange("destinationAccountId")}
          />
        </div>

        <div>
          <DropDown
            label={i18n.t("createSchedule.interval")}
            placeholder={i18n.t("placeholder.interval")}
            list={interval}
            name="scheduleIntervals"
            value={transferData.scheduleIntervals || ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setTransferData((prev) => ({ ...prev, scheduleIntervals: [selectedValue] }));
              setError({ hasError: false, message: "" });
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <AmountWithCurrency
            label={i18n.t("createSchedule.amount")}
            name="amountSend"
            value={transferData.amountSend}
            onChange={handleInputChange}
            account={sourceAccount}
            currency={sourceCurrency}
            onCurrencyChange={(code) => setTransferData((prev) => ({ ...prev, sourceCurrency: code }))}
            showAvailable={false}
          />
        </div>

        {/* the receiving currency, and the rate between two currencies */}
        <div className={styles.inputContainer}>
          <div className={sheet.field}>
            <span className={sheet.label}>{i18n.t("createTransfer.amountReceived")}</span>
            <div className={sheet.money}>
              <input type="number" readOnly aria-label={i18n.t("createTransfer.amountReceived")}
                value={Number(transferData.amountSend || 0) * (sameCurrency ? 1 : Number(transferData.exChangeRate || 0))} />
              <CurrencySelect currencies={currenciesOf(destinationAccount)} value={destinationCurrency}
                label={i18n.t("createTransfer.amountReceived")}
                onChange={(code) => setTransferData((prev) => ({ ...prev, destinationCurrency: code }))} />
            </div>
          </div>
        </div>

        {!sameCurrency && (
          <div className={styles.inputContainer}>
            <FormInput
              label={`${i18n.t("createTransfer.exchangeRate")} (1 ${sourceCurrency} = ? ${destinationCurrency})`}
              name="exChangeRate"
              type="number"
              step="any"
              value={transferData.exChangeRate}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className={styles.inputContainer}>
          <Datepicker
            label={i18n.t("createSchedule.nextExecutionDate")}
            name="nextExecutionDate"
            value={transferData.nextExecutionDate}
            onChange={(date) => {
              const localDateTime = `${date}T00:00:00.000Z`;
              setTransferData((prev) => ({ ...prev, nextExecutionDate: localDateTime }));
              setError({ hasError: false, message: "" });
            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <FormInput
            label={i18n.t("createSchedule.description")}
            name="description"
            type="textarea"
            value={transferData.description}
            onChange={handleInputChange}
          />
        </div>

        {error.hasError && <p className={styles.errorMessage} role="alert">{error.message}</p>}

        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            text={mutation.isPending ? i18n.t("buttons.loading") : i18n.t("buttons.createTransfer")}
            type="submit"
            disabled={mutation.isPending}
          />
          <Button
            variant="cancel"
            text={i18n.t("buttons.cancel")}
            onClick={cleanData}
            type="button"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateScheduledTransfer;
