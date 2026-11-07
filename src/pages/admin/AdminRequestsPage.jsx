import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  approvePaymentRequest, getPendingPaymentRequests, rejectPaymentRequest,
} from "../../api/subscriptionService";
import Button from "../../components/btns/Button";
import { formatMoney } from "../../utils/accounts/accountStatement";
import { dateFnsLocale } from "../../utils/dates";
import styles from "../../styles/components/admin/admin.module.scss";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

// "I have paid" requests, oldest first. Check the transfer app, then approve or reject.
const RequestCard = ({ request }) => {
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const locale = dateFnsLocale(i18n.language);

  const done = () => queryClient.invalidateQueries({ queryKey: ["admin"] });
  const fail = (err) => setError(typeof err?.response?.data === "string" ? err.response.data : i18n.t("admin.saveError"));

  const approve = useMutation({ mutationFn: () => approvePaymentRequest(request.id), onSuccess: done, onError: fail });
  const reject = useMutation({ mutationFn: () => rejectPaymentRequest(request.id, reason.trim()), onSuccess: done, onError: fail });

  return (
    <li className={styles.card}>
      <div className={styles.cardHeader}>
        <Link className={styles.back} to={`/admin/users/${request.userId}`}>{request.username}</Link>
        <span className={styles.muted}>{format(new Date(request.createdAt), "d MMM yyyy, HH:mm", { locale })}</span>
      </div>
      <strong>
        {i18n.t("admin.months", { count: request.months })}
        {request.amount != null && ` · ${formatMoney(request.amount, i18n.language)} ${request.currency ?? ""}`}
      </strong>
      <span>{i18n.t(`admin.methods.${request.method}`)} · {request.reference}</span>
      {request.note && <span className={styles.muted}>{request.note}</span>}

      {error && <p className={sheet.error} role="alert">{error}</p>}

      {rejecting ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <input className={styles.select} value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder={i18n.t("admin.rejectReason")} aria-label={i18n.t("admin.rejectReason")} />
          <div className={styles.actions}>
            <Button variant="cancel" text={i18n.t("buttons.cancel")} onClick={() => setRejecting(false)} />
            <Button variant="delete" text={i18n.t("admin.reject")} disabled={!reason.trim() || reject.isPending}
              onClick={() => reject.mutate()} />
          </div>
        </div>
      ) : (
        <div className={styles.actions}>
          <Button variant="primary" disabled={approve.isPending}
            text={i18n.t("admin.approve", { count: request.months })} onClick={() => approve.mutate()} />
          <Button variant="delete-outlined" text={i18n.t("admin.reject")} onClick={() => setRejecting(true)} />
        </div>
      )}
    </li>
  );
};

const AdminRequestsPage = () => {
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: getPendingPaymentRequests,
  });

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("admin.requestsTitle")}</h2>
      <p className={styles.muted}>{i18n.t("admin.requestsHint")}</p>
      {isLoading ? (
        <p className={styles.muted}>{i18n.t("messages.loading")}</p>
      ) : isError ? (
        <p className={styles.muted}>{i18n.t("admin.loadError")}</p>
      ) : requests.length === 0 ? (
        <p className={styles.muted}>{i18n.t("admin.noRequests")}</p>
      ) : (
        <ul className={styles.list}>
          {requests.map((r) => <RequestCard key={r.id} request={r} />)}
        </ul>
      )}
    </div>
  );
};

export default AdminRequestsPage;
