import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getUserSubscription, setUserEnabled } from "../../api/subscriptionService";
import StatusBadge from "../../components/admin/StatusBadge";
import ExtendSubscriptionModal from "../../components/admin/ExtendSubscriptionModal";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import Button from "../../components/btns/Button";
import { whatsappLink } from "../../utils/subscription/subscription";
import { formatMoney } from "../../utils/accounts/accountStatement";
import { dateFnsLocale, toCalendarDay } from "../../utils/dates";
import styles from "../../styles/components/admin/admin.module.scss";
import i18n from "../../configuration/i18n";

const AdminUserPage = () => {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [extendMonths, setExtendMonths] = useState(undefined); // undefined = closed
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => getUserSubscription(userId),
  });

  const enabledMutation = useMutation({
    mutationFn: (enabled) => setUserEnabled(userId, enabled),
    onSuccess: (details) => {
      queryClient.setQueryData(["admin", "user", userId], details);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  if (isLoading) return <div className={styles.page}>{i18n.t("messages.loading")}</div>;
  if (isError || !data) return <div className={styles.page}>{i18n.t("admin.loadError")}</div>;

  const { user, payments } = data;
  const sub = user.subscription;
  const locale = dateFnsLocale(i18n.language);
  const day = (value) => {
    const d = toCalendarDay(value);
    return d ? format(d, "d MMM yyyy", { locale }) : "—";
  };
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
  const message = i18n.t("admin.whatsappMessage", { name, date: day(sub?.endsAt) });
  const chat = whatsappLink(user.phone, message);

  return (
    <div className={styles.page}>
      <Link className={styles.back} to="/admin/users">{i18n.t("admin.backToUsers")}</Link>

      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{name}</h2>
          <span className={styles.muted}>{user.username} · {user.phone || i18n.t("admin.noPhone")}</span>
        </div>
        <div className={styles.actions}>
          {chat && (
            <a className={styles.whatsapp} href={chat} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          )}
          {!user.admin && (
            <Button
              variant={user.enabled ? "delete-outlined" : "primary"}
              text={user.enabled ? i18n.t("admin.disable") : i18n.t("admin.enable")}
              disabled={enabledMutation.isPending}
              onClick={() => enabledMutation.mutate(!user.enabled)}
            />
          )}
        </div>
      </div>

      <section className={styles.card} aria-labelledby="admin-sub">
        <div className={styles.cardHeader}>
          <h3 id="admin-sub" className={styles.cardTitle}>{i18n.t("admin.subscription")}</h3>
          <StatusBadge status={sub?.status} />
        </div>
        <p className={styles.endsAt}>{sub?.endsAt ? day(sub.endsAt) : i18n.t("admin.notSet")}</p>
        {sub?.daysLeft != null && (
          <span className={styles.muted}>
            {sub.daysLeft >= 0
              ? i18n.t("admin.daysLeft", { count: sub.daysLeft })
              : i18n.t("admin.daysAgo", { count: -sub.daysLeft })}
          </span>
        )}
        {!user.admin && (
          <div className={styles.actions}>
            {[1, 3, 6, 12].map((m) => (
              <button key={m} type="button" className={styles.quick} onClick={() => setExtendMonths(m)}>
                + {i18n.t("admin.months", { count: m })}
              </button>
            ))}
            <button type="button" className={styles.quick} onClick={() => setExtendMonths(null)}>
              {i18n.t("admin.chooseDate")}
            </button>
          </div>
        )}
      </section>

      <section className={styles.card} aria-labelledby="admin-payments">
        <h3 id="admin-payments" className={styles.cardTitle}>{i18n.t("admin.payments")}</h3>
        {payments.length === 0 ? (
          <p className={styles.muted}>{i18n.t("admin.noPayments")}</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{i18n.t("admin.recordedOn")}</th>
                  <th scope="col">{i18n.t("admin.newEnd")}</th>
                  <th scope="col">{i18n.t("admin.amount")}</th>
                  <th scope="col">{i18n.t("admin.method")}</th>
                  <th scope="col">{i18n.t("admin.reference")}</th>
                  <th scope="col">{i18n.t("admin.recordedBy")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.createdAt ? format(new Date(p.createdAt), "d MMM yyyy", { locale }) : "—"}</td>
                    <td>{day(p.newEndsAt)}</td>
                    <td>{p.amount != null ? `${formatMoney(p.amount, i18n.language)} ${p.currency ?? ""}` : "—"}</td>
                    <td>{p.method ? i18n.t(`admin.methods.${p.method}`) : "—"}</td>
                    <td>{[p.reference, p.note].filter(Boolean).join(" · ") || "—"}</td>
                    <td>{p.recordedBy ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={`${styles.card} ${styles.danger}`} aria-labelledby="admin-danger">
        <h3 id="admin-danger" className={styles.cardTitle}>{i18n.t("admin.delete.zone")}</h3>
        <p className={styles.muted} style={{ margin: 0 }}>{i18n.t("admin.delete.explain")}</p>
        <div className={styles.actions}>
          <Button variant="delete-outlined" text={i18n.t("admin.delete.button")} onClick={() => setDeleting(true)} />
        </div>
      </section>

      {deleting && <DeleteUserModal user={user} onClose={() => setDeleting(false)} />}

      {extendMonths !== undefined && (
        <ExtendSubscriptionModal
          userId={userId}
          months={extendMonths}
          onClose={() => setExtendMonths(undefined)}
        />
      )}
    </div>
  );
};

export default AdminUserPage;
