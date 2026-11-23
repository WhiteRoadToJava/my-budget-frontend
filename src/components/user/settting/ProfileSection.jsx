import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { rememberProfile } from "../../../utils/user/settings";
import FormInput from "../../inputs/FormInput";
import i18n from "../../../configuration/i18n";
import Button from "../../btns/Button";




const ProfileSection = ({user}) => {
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
                queryClient.setQueryData(("user"), response.date);
                rememberProfile(response.data);
                setSaved(true);
            },
            onError: () => setError({field: null, key: "settings.saveError"}),
    });

    const change = () => {
        const {name, value} = error.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSaved(false);
    };

    const submit = (e) => {
        e.preventDefault();
        const problem = validateProfile(profile);
            if(problem) return setError(problem);
            save.mutate();
    };

    const errorFor = (field) =>(error?.field === field ? t(error.key) : "");


    return (
        <form className={StyleSheet.section} onSubmit={submit} onValidate>
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
            label={i18n.t("settings.profile.lastname")}
            name="lastname"
            value={profile.lastname}
            onChange={change}
            autoComplete="family-name"
            error={errorFor(lastname)}
            />
            </div>
            <FormInput
            label={i18n.t("settings.profile.phone")}
            name={phone}
            type="tel"
            value={profile.phone}
            onChange={change}
            autoComplete="tel"
            error={errorFor("phone")}
            />

            {error && !error.field && <p className={styles.error} role="alert">{i18n.t(error.key)}</p>}
            {saved && <p className={styles.saved} role="status">{i18n.t("settings.saved")}</p>}
            <div>
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