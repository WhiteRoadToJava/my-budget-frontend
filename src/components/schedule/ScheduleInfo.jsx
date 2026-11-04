import React, { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DetailsSheet from "../details/DetailsSheet";
import Button from "../btns/Button";
import DeleteConfimation from "../modals/DeleteConfirmation";
import UpdateSchedule from "./UpdateSchedule";
import { deleteSchedule, updateSchedule } from "../../api/scheduleService";
import { getAccounts } from "../../api/accountService";
import { findCategory } from "../../assiets/categories/assits";
import transferIcon from "../../assiets/categories/icons/currency.svg";
import { rollForwardExecutionDate } from "../../utils/scheduleDate.js";
import { scheduleTypeKey } from "../../utils/debts/scheduleTypes";
import { intervalLabelKey } from "../../utils/debts/debtSchedules";
import { categoryName } from "../../utils/transactionTypes";
import { formatNumber } from "../../utils/formating";
import { dateFnsLocale, toCalendarDay } from "../../utils/dates";
import i18n from "../../configuration/i18n";

const TONE = { INCOMSE: "in", EXPENSE: "out", TRANSFER: "transfer", DEBT_PAYMENT: "debt" };
// schedule types map to the transaction types findCategory knows
const CATEGORY_TYPE = { INCOMSE: "incomse", EXPENSE: "expense", DEBT_PAYMENT: "debt-out" };

const ScheduleInfo = ({ isOpen, onClose, accounts, schedule }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  // the parent keeps the schedule it was opened with, so after pause/resume we
  // show the copy returned by the backend until the sheet is closed
  const [updatedSchedule, setUpdatedSchedule] = useState(null);

  // the schedule only carries the account id and name; the currency comes from the accounts
  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });

  const current =
    updatedSchedule && updatedSchedule.id === schedule?.id ? updatedSchedule : schedule;
  const type = current?.transactionType;
  const isActive = current?.isActive !== false;
  const isDebtPayment = type === "DEBT_PAYMENT";
  const isTransfer = type === "TRANSFER";
  const locale = dateFnsLocale(i18n.language);
  const allAccounts = accountsData?.accounts ?? [];
  const currencyOf = (account) => allAccounts.find((a) => a.id === account?.id)?.currency ?? "";
  const currency = currencyOf(current?.sourceAccount);
  const category = CATEGORY_TYPE[type] ? findCategory(current?.category, CATEGORY_TYPE[type]) : null;
  const nextDate = toCalendarDay(current?.executionDate);

  const close = () => {
    setUpdatedSchedule(null);
    setError(null);
    onClose();
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteSchedule(current.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setConfirmDelete(false);
      close();
    },
    onError: () => {
      setConfirmDelete(false);
      setError(i18n.t("messages.errorDeleteSchedule"));
    },
  });

  const toggleActive = useMutation({
    mutationFn: (data) => updateSchedule(current.id, data),
    onSuccess: (saved) => {
      setUpdatedSchedule(saved);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: () => setError(i18n.t("messages.errorUpdateSchedule")),
  });

  // the update endpoint replaces every field, so send the whole schedule
  // with only isActive (and, when resuming, the next date) changed
  const handleToggleActive = () => {
    const resuming = !isActive;
    toggleActive.mutate({
      name: current.name,
      description: current.description,
      category: current.category,
      scheduleIntervalSet: [current.scheduleInterval],
      amountSend: current.amountSend,
      exChangeRate: current.exChangeRate,
      amountReceived: current.amountReceived,
      nextExecutionDate: resuming
        ? rollForwardExecutionDate(current.executionDate, current.scheduleInterval)
        : current.executionDate,
      isActive: resuming,
    });
  };

  const intervalKey = intervalLabelKey(current?.scheduleInterval);
  const receivedDiffers =
    isTransfer && current?.amountReceived && Number(current.exChangeRate ?? 1) !== 1;

  const fields = [
    { label: i18n.t("scheduleInfo.status"),
      value: i18n.t(isActive ? "scheduleInfo.active" : "scheduleInfo.paused") },
    { label: i18n.t("scheduleInfo.interval"),
      value: intervalKey ? i18n.t(intervalKey) : current?.scheduleInterval },
    isActive && nextDate && { label: i18n.t("scheduleInfo.nextExecutionDate"),
      value: format(nextDate, "d MMMM yyyy", { locale }) },
    !isTransfer && { label: i18n.t("scheduleInfo.account"), value: current?.sourceAccount?.name },
    isTransfer && { label: i18n.t("transactionDetails.sourceAccount"), value: current?.sourceAccount?.name },
    isTransfer && { label: i18n.t("transactionDetails.destinationAccount"), value: current?.destinationAccount?.name },
    receivedDiffers && { label: i18n.t("scheduleInfo.amountReceived"),
      value: `${formatNumber(current.amountReceived)} ${currencyOf(current.destinationAccount)}` },
    category && !isDebtPayment && { label: i18n.t("scheduleInfo.category"), value: categoryName(category) },
    { label: i18n.t("scheduleInfo.description"), value: current?.description },
  ].filter(Boolean);

  const actions = [
    isDebtPayment && current?.debtId && (
      <Button key="open-debt" text={i18n.t("debts.openDebt")} type="button"
        onClick={() => { close(); navigate(`/user/debts/${current.debtId}`); }} />
    ),
    <Button key="delete" variant="delete-outlined" text={i18n.t("buttons.delete")} type="button"
      onClick={() => setConfirmDelete(true)} disabled={deleteMutation.isPending} />,
    <Button key="toggle" variant="secondary" type="button"
      text={isActive ? i18n.t("buttons.pause") : i18n.t("buttons.resume")}
      onClick={handleToggleActive} disabled={toggleActive.isPending} />,
    <Button key="edit" variant="primary" text={i18n.t("buttons.edit")} type="button"
      onClick={() => setEditOpen(true)} />,
  ].filter(Boolean);

  return (
    <>
      <DetailsSheet
        isOpen={isOpen}
        onClose={close}
        tone={isActive ? TONE[type] : undefined}
        icon={isTransfer ? transferIcon : category?.icon}
        kicker={i18n.t(scheduleTypeKey(type))}
        title={current?.name}
        amount={`${formatNumber(Number(current?.amountSend ?? 0))} ${currency}`}
        note={isActive ? null : i18n.t("scheduleInfo.pausedNote")}
        fields={fields}
        error={error}
        actions={actions}
      />

      <DeleteConfimation
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onDelete={() => deleteMutation.mutate()}
      />
      <UpdateSchedule
        isOpen={editOpen}
        isClose={() => setEditOpen(false)}
        schedule={current}
        accounts={accounts}
      />
    </>
  );
};

export default ScheduleInfo;
