import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormInput from "../../inputs/FormInput";
import Button from "../../btns/Button";
import { updateUser } from "../../../api/userService";
import { rememberProfile, validateProfile } from "../../../utils/user/settings";
import styles from "../../../styles/pages/setting/settingPage.module.scss";
import i18n from "../../../configuration/i18n";

// Name and phone; the email is the username and stays as it is.
// Rendered with key={user.username}, so it starts from the loaded user.
const ProfileSection = ({ user }) => {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState({
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    phone: user.phone ?? "",
  });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      updateUser({
        firstname: profile.firstname.trim(),
        lastname: profile.lastname.trim(),
        phone: profile.phone.trim(),
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], response.data);
      rememberProfile(response.data);
      setSaved(true);
    },
    onError: () => setError({ field: null, key: "settings.saveError" }),
  });

  const change = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSaved(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const problem = validateProfile(profile);
    if (problem) return setError(problem);
    save.mutate();
  };

  const errorFor = (field) => (error?.field === field ? i18n.t(error.key) : "");

  return (
    <form className={styles.section} onSubmit={submit} noValidate>
      <h2 className={styles.sectionTitle}>{i18n.t("settings.profile.title")}</h2>

      <FormInput
        label={i18n.t("settings.profile.email")}
        name="email"
        value={user.username ?? ""}
        disabled
        readOnly
      />
      <div className={styles.twoColumns}>
        <FormInput
          label={i18n.t("settings.profile.firstName")}
          name="firstname"
          value={profile.firstname}
          onChange={change}
          autoComplete="given-name"
          error={errorFor("firstname")}
        />
        <FormInput
          label={i18n.t("settings.profile.lastName")}
          name="lastname"
          value={profile.lastname}
          onChange={change}
          autoComplete="family-name"
          error={errorFor("lastname")}
        />
      </div>
      <FormInput
        label={i18n.t("settings.profile.phone")}
        name="phone"
        type="tel"
        value={profile.phone}
        onChange={change}
        autoComplete="tel"
        error={errorFor("phone")}
      />

      {error && !error.field && <p className={styles.error} role="alert">{i18n.t(error.key)}</p>}
      {saved && <p className={styles.saved} role="status">{i18n.t("settings.saved")}</p>}

      <div className={styles.actions}>
        <Button
          type="submit"
          disabled={save.isPending}
          text={save.isPending ? i18n.t("buttons.processing") : i18n.t("settings.save")}
        />
      </div>
    </form>
  );
};

export default ProfileSection;