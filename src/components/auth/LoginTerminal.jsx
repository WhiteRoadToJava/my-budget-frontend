import styles from "../../styles/auth/loginTerminal.module.scss";
import i18n from "../../configuration/i18n";  

export default function LoginTerminal() {
  return (
    <div className={styles.rules}>
      <div className={styles.typingDemo}>{i18n.t("terminal.terminal")}</div>
      <div className={styles.typingDemoTwo}>{i18n.t("terminal.terminalTwo")}</div>
      <div className={styles.typingDemoThree}>{i18n.t("terminal.terminalThree")}</div>
    </div>
  );
}
