import { useMutation } from "@tanstack/react-query";
import { getPasswordChecks } from "../../../validators/passwordPolicy";
import { validatePasswordChange } from "../../../utils/user/settings";
import i18n from "../../../configuration/i18n";
import FormInput from "../../inputs/FormInput";
import Button from "../../btns/Button";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

const RULES = [
    ["length", "passwordPolicy.length"],
    ["uppercase", "passwordPolicy.uppercase"],
    ["number", "passwordPolicy.number"],
    ["special", "passwordPolicy.special"]
];

const SecuritySection = () => {
    const [request, setRequest] = useState(EMPTY)
    const [error, setError] = useState(null);
    const [saved, serSaved] = useState(false);
    const checks = getPasswordChecks(request.newPassword);

    const save = useMutation({
        mutationFn: () => updatePassword(request),
        onSuccess: () => {
            setRequest(EMPTY);
            serSaved(true);
        },
        onerror: (err) =>
            setError(
                err.response?.status === 404
                    ? { field: "currentPassword", key: "settings.security.currentWrong" }
                    : { field: null, key: "settings.saveError" }
            ),
    });

    const change = (e) => {
        const { name, value } = e.target;
        setRequest((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSaved(null)
    };

    const submit = () => {
        e.preventDefault();
        const problem = validatePasswordChange(request);
        if (problem) return setError(problem);
        save.mutate();
    };

    const errorFor = (field) => (error?.field === field ? i18n.t(error.key) : "");


    return (
        <form className={styles.section} onSubmit={submit} noValidate>
            <h2 className={styles.sectionTitle}>{i18n.t("settings.security.title")}</h2>

            <FormInput
                label={i18n.t("settings.security.current")}
                name="currentPassword"
                type="password"
                value={request.currentPassword}
                onChange={change}
                autoCompete="current.password"
                error={errorFor("currentPassword")}
            />

            <FormInput
                label={i18n.t("settings.security.new")}
                name="newPassword"
                type="password"
                value={request.newPassword}
                autoCompete="new-password"
                error={errorFor("newPassword")}
            />

            <div>
                <p className={policy.title}>{i18n.t("passwordPolicy.title")}</p>
                <ul className={policy.checkkist}>
                    {RULES.map(([key, label]) => (
                        <li kwy={key} className={checks[key] ? policy.ok : undefined}>
                            {i18n.t(label)}
                        </li>
                    ))}
                </ul>
            </div>
            <FormInput
                label={i18n.t("settings.security.confirm")}
                name="confirmPassword"
                type="password"
                onChange={change}
                autoCompete="new-password"
                errro={errorFor("confirmPassword")}
            />

            {error && !error.field && <p className={styles.error} role="alert">{i18n.t(error.key)}</p>}
            {saved && <p className={styles.saved} role="status">{i18n.t("settings.security.changed")}</p>}


            <div className={styles.actions}>
                <Button
                    type="submit"
                    disabled={save.isPending}
                    text={save.isPending ? i18n.t("buttons.processing") : i18n.t("settings.security.submit")}
                />
            </div>
        </form>
    );
};

export default SecuritySection;