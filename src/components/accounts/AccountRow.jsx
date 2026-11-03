import React, { useState } from "react";
import styles from "../../styles/components/accounts/accountRow.module.scss";
import { useNavigate } from "react-router-dom";
import ToggleMenu from "../elements/ToggleMenu";
import Button from "../btns/Button";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import { deleteAccount, updateAccountStatus } from "../../api/accountService";
import { formatNumber } from "../../utils/formating";
import { changeSinceOpening, isArchived } from "../../utils/accounts/accountList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpdateAccount from "./UpdateAccount";
import i18n from "../../configuration/i18n";

const signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${formatNumber(Math.abs(n))}`;

const Row = ({ account }) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openEditAccount, setOpenEditAccount] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const archived = isArchived(account);
  const change = changeSinceOpening(account);
  const total = Number(account.totalBalance ?? 0);
  const typeKey = `accountsPage.types.${account.type}`;
  const typeLabel = i18n.exists(typeKey) ? i18n.t(typeKey) : account.type;

  const open = () => navigate(`/user/accounts/${account.id}`);

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount(account.id),
    onSuccess: () => {
      setOpenDeleteConfirmation(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      setOpenDeleteConfirmation(false);
      // 409: the account has debt movements
      setError(
        err?.response?.status === 409
          ? i18n.t("debts.errorAccountHasDebt")
          : i18n.t("messages.errorDeleteAccount"),
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: () => updateAccountStatus(account.id, archived ? "ACTIVE" : "ARCHIVED"),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => setError(i18n.t("messages.errorUpdateAccount")),
  });

  const menuItems = [
    <Button key="edit" text={i18n.t("buttons.edit")} variant="primary" type="button"
      onClick={() => setOpenEditAccount(true)} />,
    <Button key="status" text={archived ? i18n.t("buttons.active") : i18n.t("buttons.archived")}
      variant="primary" type="button" onClick={() => statusMutation.mutate()} />,
    <Button key="delete" text={i18n.t("buttons.delete")} variant="delete" type="button"
      onClick={() => setOpenDeleteConfirmation(true)} />,
  ];

  return (
    <li>
      <div className={styles.row} data-archived={archived}>
        <button type="button" className={styles.main} onClick={open}>
          <span className={styles.identity}>
            <span className={styles.name}>{account.name}</span>
            <span className={styles.type}>{typeLabel}</span>
          </span>

          <span className={styles.change}>
            <span className={change > 0 ? styles.up : change < 0 ? styles.down : undefined}>
              {signed(change)}
            </span>{" "}
            {i18n.t("accountsPage.sinceOpening")}
          </span>

          <span className={`${styles.amount} ${total < 0 ? styles.negative : ""}`}>
            {formatNumber(total)}
            <span className={styles.currency}>{account.currency}</span>
          </span>
        </button>

        <div className={styles.menu}>
          <ToggleMenu menuList={menuItems} />
        </div>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}

      <DeleteConfirmation
        isOpen={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
        onDelete={() => deleteMutation.mutate()}
      />
      <UpdateAccount
        isOpen={openEditAccount}
        isClose={() => setOpenEditAccount(false)}
        account={account}
      />
    </li>
  );
};

export default Row;
