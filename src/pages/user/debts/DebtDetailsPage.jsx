import React, { useState } from "react";
import { parseISO } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDebt, deleteDebtMovement, getDebt } from "../../../api/debtService";
import i18n from "../../../configuration/i18n";
import styles from "../../../styles/components/debts/debtDetails.module.scss";
import DebtSummaryCards from "../../../components/debts/DebtSummaryCards";
import DebtMovementsTable from "../../../components/debts/DebtMovementsTable";
import DeleteConfirmation from "../../../components/modals/DeleteConfirmation";
import Button from "../../../components/btns/Button";

const COMPOUNDING = {
  NONE: "debts.compoundingNone",
  MONTHLY: "debts.compoundingMonthly",
  YEARLY: "debts.compoundingYearly",
};

const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [movementToDelete, setMovementToDelete] = useState(null);
  const [confirmDeleteDebt, setConfirmDeleteDebt] = useState(false);
  const [error, setError] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["debts", debtId],
    queryFn: () => getDebt(debtId),
  });

  // a movement changes the debt, the account balance and the transaction lists
  const refreshAfterChange = () => {
    queryClient.invalidateQueries({ queryKey: ["debts"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const deleteMovementMutation = useMutation({
    mutationFn: (movementId) => deleteDebtMovement(debtId, movementId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["debts", debtId], updated);
      refreshAfterChange();
      setMovementToDelete(null);
      setError(null);
    },
    onError: () => {
      setMovementToDelete(null);
      setError(i18n.t("debts.errorDeleteMovement"));
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: () => deleteDebt(debtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      navigate("/user/debts");
    },
    onError: (err) => {
      setConfirmDeleteDebt(false);
      // 400: the debt still has movements
      setError(
        err?.response?.status === 400
          ? i18n.t("debts.errorHasMovements")
          : i18n.t("debts.errorDelete"),
      );
    },
  });

  if (isLoading) return <div className={styles.page}>{i18n.t("debts.loading")}</div>;
  if (isError || !data?.debt) {
    return (
      <div className={styles.page}>
        <p>{i18n.t("debts.notFound")}</p>
        <Link className={styles.back} to="/user/debts">{i18n.t("debts.backToList")}</Link>
      </div>
    );
  }

  const { debt, movements = [] } = data;
  const directionLabel =
    debt.direction === "OWED_BY_ME" ? i18n.t("debts.owedByMe") : i18n.t("debts.owedToMe");

  const info = [
    { label: "debts.currency", value: debt.currency },
    { label: "debts.annualRate", value: `${debt.annualRate ?? 0}%` },
    { label: "debts.compounding", value: i18n.t(COMPOUNDING[debt.compounding] ?? COMPOUNDING.NONE) },
    { label: "debts.startDate", value: debt.startDate ? parseISO(debt.startDate).toLocaleDateString() : "—" },
    { label: "debts.countInflowsAsIncome", value: i18n.t(debt.countInflowsAsIncome ? "buttons.yes" : "buttons.no") },
    { label: "debts.countOutflowsAsExpense", value: i18n.t(debt.countOutflowsAsExpense ? "buttons.yes" : "buttons.no") },
  ];

  return (
    <div className={styles.page}>
      <Link className={styles.back} to="/user/debts">{i18n.t("debts.backToList")}</Link>

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{debt.name}</h2>
          {debt.counterparty && <p className={styles.subtitle}>{debt.counterparty}</p>}
        </div>
        <div className={styles.actions}>
          <span className={styles.badge} data-direction={debt.direction}>{directionLabel}</span>
          <Button
            variant="delete-outlined"
            text={i18n.t("buttons.delete")}
            onClick={() => setConfirmDeleteDebt(true)}
            disabled={movements.length > 0 || deleteDebtMutation.isPending}
          />
        </div>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <DebtSummaryCards summary={debt.summary} currency={debt.currency} />

      <section className={styles.infoGrid} aria-label={i18n.t("debts.detailsTitle")}>
        {info.map((item) => (
          <div key={item.label} className={styles.infoItem}>
            <span className={styles.label}>{i18n.t(item.label)}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </section>

      {debt.note && <p className={styles.subtitle}>{debt.note}</p>}

      <h3 className={styles.sectionTitle}>{i18n.t("debts.movements")}</h3>
      <DebtMovementsTable
        movements={movements}
        currency={debt.currency}
        onDelete={setMovementToDelete}
        deletingId={deleteMovementMutation.isPending ? movementToDelete?.id : null}
      />

      <DeleteConfirmation
        isOpen={!!movementToDelete}
        onClose={() => setMovementToDelete(null)}
        onDelete={() => deleteMovementMutation.mutate(movementToDelete.id)}
      />
      <DeleteConfirmation
        isOpen={confirmDeleteDebt}
        onClose={() => setConfirmDeleteDebt(false)}
        onDelete={() => deleteDebtMutation.mutate()}
      />
    </div>
  );
};

export default DebtDetailsPage;
