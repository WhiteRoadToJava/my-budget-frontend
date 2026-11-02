import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDebt } from "../../../api/debtService";
import i18n from "../../../configuration/i18n";

// F1: route, data loading and navigation only. The details design comes in F3.
const DebtDetailsPage = () => {
  const { debtId } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["debts", debtId],
    queryFn: () => getDebt(debtId),
  });

  if (isLoading) return <div>{i18n.t("debts.loading")}</div>;
  if (isError || !data?.debt) {
    return (
      <div>
        <p>{i18n.t("debts.notFound")}</p>
        <Link to="/user/debts">{i18n.t("debts.backToList")}</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/user/debts">{i18n.t("debts.backToList")}</Link>
      <h2>{data.debt.name}</h2>
    </div>
  );
};

export default DebtDetailsPage;
