import React, { useDeferredValue, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserStats, searchUsers } from "../../api/subscriptionService";
import StatusBadge from "../../components/admin/StatusBadge";
import SearchInput from "../../components/inputs/SearchInput";
import Button from "../../components/btns/Button";
import { toCalendarDay, dateFnsLocale } from "../../utils/dates";
import { format } from "date-fns";
import styles from "../../styles/components/admin/admin.module.scss";
import i18n from "../../configuration/i18n";

// the numbers are also the filters
const STAT_FILTERS = [
  { key: "users", filter: "" },
  { key: "trial", filter: "TRIAL" },
  { key: "active", filter: "ACTIVE" },
  { key: "expiringIn7Days", filter: "EXPIRING" },
  { key: "expired", filter: "EXPIRED" },
  { key: "notSet", filter: "NOT_SET" },
];
const PAGE_SIZE = 20;

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  // typing does not send a request per key press
  const q = useDeferredValue(text.trim());

  const { data: stats } = useQuery({ queryKey: ["admin", "stats"], queryFn: getUserStats });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", q, filter, page],
    queryFn: () => searchUsers({ q, filter, page, size: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const locale = dateFnsLocale(i18n.language);
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("admin.usersTitle")}</h2>

      <div className={styles.stats} role="group" aria-label={i18n.t("admin.filters")}>
        {STAT_FILTERS.map((s) => (
          <button key={s.key} type="button" className={styles.stat} aria-pressed={filter === s.filter}
            onClick={() => { setFilter(s.filter); setPage(0); }}>
            <span className={styles.statValue}>{stats ? stats[s.key] : "–"}</span>
            <span className={styles.muted}>{i18n.t(`admin.stats.${s.key}`)}</span>
          </button>
        ))}
      </div>

      <div className={styles.search}>
        <SearchInput
          value={text}
          onChange={(e) => { setText(e.target.value); setPage(0); }}
          placeholder={i18n.t("admin.searchPlaceholder")}
          aria-label={i18n.t("admin.searchPlaceholder")}
        />
      </div>

      {isLoading ? (
        <p className={styles.muted}>{i18n.t("messages.loading")}</p>
      ) : isError ? (
        <p className={styles.muted}>{i18n.t("admin.loadError")}</p>
      ) : data.items.length === 0 ? (
        <p className={styles.muted}>{i18n.t("admin.noUsers")}</p>
      ) : (
        <ul className={styles.list}>
          {data.items.map((u) => {
            const end = toCalendarDay(u.subscription?.endsAt);
            const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
            return (
              <li key={u.id}>
                <button type="button" className={styles.userRow} onClick={() => navigate(`/admin/users/${u.id}`)}>
                  <span className={styles.userName}>
                    <strong>{name || u.username}</strong>
                    <span className={styles.muted}>{u.username}</span>
                  </span>
                  <span className={`${styles.muted} ${styles.hideSmall}`}>{u.phone || "—"}</span>
                  <StatusBadge status={u.subscription?.status} />
                  <span className={`${styles.muted} ${styles.hideSmall}`}>
                    {end ? format(end, "d MMM yyyy", { locale }) : "—"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {data && data.total > PAGE_SIZE && (
        <div className={styles.pager}>
          <Button variant="secondary" text={i18n.t("admin.previous")} disabled={page === 0}
            onClick={() => setPage((p) => p - 1)} />
          <span className={styles.muted}>{i18n.t("admin.pageOf", { page: page + 1, pages })}</span>
          <Button variant="secondary" text={i18n.t("admin.next")} disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)} />
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
