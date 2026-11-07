import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdmins, inviteAdmin, resendAdminInvitation } from "../../api/admin/adminService";
import FormInput from "../../components/inputs/FormInput";
import Button from "../../components/btns/Button";
import { LANGUAGES } from "../../configuration/languages";
import styles from "../../styles/components/admin/admin.module.scss";
import sheet from "../../styles/components/forms/formSheet.module.scss";
import i18n from "../../configuration/i18n";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyForm = () => ({ email: "", firstName: "", lastName: "", phone: "", language: i18n.language || "ar" });
const backendMessage = (err, fallbackKey) =>
  typeof err?.response?.data === "string" && err.response.data ? err.response.data : i18n.t(fallbackKey);

// One admin; "pending" until the invitation link was used to choose a password.
const AdminRow = ({ admin }) => {
  const [message, setMessage] = useState(null);
  const resend = useMutation({
    mutationFn: () => resendAdminInvitation(admin.id, i18n.language),
    onSuccess: () => setMessage(i18n.t("admin.admins.resent")),
    onError: (err) => setMessage(backendMessage(err, "admin.saveError")),
  });
  const name = [admin.firstName, admin.lastName].filter(Boolean).join(" ") || admin.username;

  return (
    <li className={styles.card} style={{ padding: "0.7rem 0.9rem" }}>
      <div className={styles.cardHeader}>
        <span className={styles.userName}>
          <strong>{name}</strong>
          <span className={styles.muted}>{admin.username}</span>
        </span>
        <span className={styles.badge} data-status={admin.pending ? "GRACE" : "ACTIVE"}>
          {i18n.t(admin.pending ? "admin.admins.pending" : "admin.admins.active")}
        </span>
      </div>
      {admin.pending && (
        <div className={styles.actions}>
          <Button variant="secondary" text={i18n.t("admin.admins.resend")} disabled={resend.isPending}
            onClick={() => resend.mutate()} />
        </div>
      )}
      {message && <span className={styles.muted} role="status">{message}</span>}
    </li>
  );
};

const AdminAdminsPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);
  const set = (changes) => { setForm((f) => ({ ...f, ...changes })); setError(null); setSentTo(null); };

  const { data: admins = [], isLoading } = useQuery({ queryKey: ["admin", "admins"], queryFn: getAdmins });

  const invite = useMutation({
    mutationFn: inviteAdmin,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
      setSentTo(created.username);
      setForm(emptyForm());
    },
    onError: (err) => setError(
      err?.response?.status === 409 ? i18n.t("admin.admins.exists") : backendMessage(err, "admin.saveError"),
    ),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL.test(form.email.trim())) return setError(i18n.t("admin.admins.invalidEmail"));
    if (!form.firstName.trim()) return setError(i18n.t("admin.admins.nameRequired"));
    invite.mutate({
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      phone: form.phone.trim() || null,
      language: form.language,
    });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("admin.admins.title")}</h2>

      <section className={styles.card} aria-labelledby="invite-admin">
        <h3 id="invite-admin" className={styles.cardTitle}>{i18n.t("admin.admins.invite")}</h3>
        <p className={styles.muted} style={{ margin: 0 }}>{i18n.t("admin.admins.inviteHint")}</p>
        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div className={styles.formGrid}>
            <FormInput label={i18n.t("admin.admins.email")} name="email" type="email"
              value={form.email} onChange={(e) => set({ email: e.target.value })} />
            <div className={sheet.field}>
              <label className={sheet.label} htmlFor="invite-language">{i18n.t("admin.admins.emailLanguage")}</label>
              <select id="invite-language" className={styles.select} value={form.language}
                onChange={(e) => set({ language: e.target.value })}>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
              </select>
            </div>
            <FormInput label={i18n.t("admin.admins.firstName")} name="firstName" type="text"
              value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
            <FormInput label={i18n.t("admin.admins.lastName")} name="lastName" type="text"
              value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
            <FormInput label={i18n.t("admin.admins.phone")} name="phone" type="tel"
              value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </div>
          {error && <p className={sheet.error} role="alert">{error}</p>}
          {sentTo && <p className={styles.muted} role="status">{i18n.t("admin.admins.sent", { email: sentTo })}</p>}
          <div className={styles.actions}>
            <Button variant="primary" type="submit" disabled={invite.isPending}
              text={invite.isPending ? i18n.t("buttons.processing") : i18n.t("admin.admins.send")} />
          </div>
        </form>
      </section>

      <section className={styles.card} aria-labelledby="admins-list">
        <h3 id="admins-list" className={styles.cardTitle}>{i18n.t("admin.admins.list")}</h3>
        {isLoading ? (
          <p className={styles.muted}>{i18n.t("messages.loading")}</p>
        ) : (
          <ul className={styles.list}>
            {admins.map((a) => <AdminRow key={a.id} admin={a} />)}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminAdminsPage;
