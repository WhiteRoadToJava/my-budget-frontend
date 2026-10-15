import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/btns/Button";
import LoadingSpinner from "../../components/displays/LoadingSpinner.jsx";
import ResendActivation from "../../components/auth/ResendActivation.jsx";
import { activateAccount } from "../../api/authService.js";
import i18n from "../../configuration/i18n.js";
import layout from "../../styles/pages/auth/register.module.scss";
import styles from "../../styles/auth/activation.module.scss";

// loading | success | invalid | expired | error
export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState(token ? "loading" : "invalid");

  // React StrictMode runs effects twice in development. The token is one-time use,
  // so the second call would fail with TOKEN_INVALID and hide the real success.
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    activateAccount(token)
      .then(() => setStatus("success"))
      .catch((error) => {
        const code = error.response?.data?.code;
        if (code === "TOKEN_EXPIRED") setStatus("expired");
        else if (code === "TOKEN_INVALID") setStatus("invalid");
        else setStatus("error");
      });
  }, [token]);

  const goToLogin = () => navigate("/auth/login");

  return (
    <div className={layout.authLayout}>
      <div className={styles.formContainer}>
        {status === "loading" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("activation.activating")}</p>
            </div>
            <div className={styles.spinner}>
              <LoadingSpinner />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("activation.successTitle")}</p>
            </div>
            <p className={styles.message}>{i18n.t("activation.successText")}</p>
            <div className={styles.btnGroup}>
              <Button
                variant="primary"
                text={i18n.t("activation.goToLogin")}
                onClick={goToLogin}
                paddingSize="12px 20px"
                fontSize="16px"
              />
            </div>
          </>
        )}

        {status === "expired" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("activation.expiredTitle")}</p>
            </div>
            <p className={styles.message}>{i18n.t("activation.expiredText")}</p>
            <ResendActivation />
          </>
        )}

        {status === "invalid" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("activation.invalidTitle")}</p>
            </div>
            <p className={styles.message}>{i18n.t("activation.invalidText")}</p>
            <ResendActivation />
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.header}>
              <p>{i18n.t("activation.errorTitle")}</p>
            </div>
            <p className={styles.message}>{i18n.t("activation.errorText")}</p>
          </>
        )}

        {status !== "loading" && status !== "success" && (
          <p className={styles.loginLink}>
            <Link to="/auth/login">{i18n.t("activation.backToLogin")}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
