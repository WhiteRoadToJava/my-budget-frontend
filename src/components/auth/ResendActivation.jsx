import { useEffect, useState } from "react";
import Button from "../btns/Button";
import { resendActivation } from "../../api/authService.js";
import i18n from "../../configuration/i18n.js";
import styles from "../../styles/auth/activation.module.scss";

// same as the backend cooldown between two activation emails
const COOLDOWN_SECONDS = 60;

/**
 * "Resend activation email" button.
 * - with an `email` prop it just uses it (register success screen, login 403)
 * - without it, it shows an input so the user can type the address (expired link page)
 */
export default function ResendActivation({ email = "" }) {
  const [typedEmail, setTypedEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [secondsLeft, setSecondsLeft] = useState(0);

  const address = (email || typedEmail).trim();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!address || status === "sending" || secondsLeft > 0) return;
    setStatus("sending");
    try {
      await resendActivation(address, i18n.language);
      setStatus("sent");
      setSecondsLeft(COOLDOWN_SECONDS);
    } catch {
      setStatus("error");
    }
  };

  const buttonText =
    secondsLeft > 0
      ? i18n.t("activation.resendWait", { seconds: secondsLeft })
      : i18n.t("activation.resend");

  return (
    <div className={styles.resend}>
      {!email && (
        <input
          className={styles.input}
          type="email"
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          placeholder={i18n.t("activation.emailPlaceholder")}
          autoComplete="email"
        />
      )}
      <Button
        variant="secondary"
        text={buttonText}
        onClick={handleResend}
        disabled={!address || status === "sending" || secondsLeft > 0}
        paddingSize="10px 16px"
        fontSize="15px"
      />
      {status === "sent" && (
        <p className={styles.successMessage} role="status">
          {i18n.t("activation.resendSent")}
        </p>
      )}
      {status === "error" && (
        <p className={styles.errorMessage} role="alert">
          {i18n.t("activation.resendError")}
        </p>
      )}
    </div>
  );
}
