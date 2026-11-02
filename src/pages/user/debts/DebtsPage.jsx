import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDebts } from "../../../api/debtService";
import i18n from "../../../configuration/i18n";

// F1: route, data loading and navigation only. The list design comes in F2.
const DebtsPage = () => {
  const { data: debts = [], isLoading, isError } = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
  });

  if (isLoading) return <div>{i18n.t("debts.loading")}</div>;
  if (isError) return <div>{i18n.t("debts.loadError")}</div>;

  return (
    <div>
      <h2>{i18n.t("debts.title")}</h2>
      {debts.length === 0 ? (
        <p>{i18n.t("debts.empty")}</p>
      ) : (
        <ul>
          {debts.map((debt) => (
            <li key={debt.id}>
              <Link to={`/user/debts/${debt.id}`}>{debt.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebtsPage;
