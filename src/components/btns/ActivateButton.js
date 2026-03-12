import styles from "src/styles/elements/btns/activateButton.module.scss";

export default function ActivateButton({
  initialText = "Activate",
  loadingText = "Waiting",
  completedText = "Activated!",
  onClick,
  buttonState,
  textState,
}) {
  return (
    <button
      className={`${styles.activateBtn} ${styles[buttonState]} ${styles[textState]}`}
      onClick={onClick}
    >
      <span className={styles.circle}>
        <span className={`${styles.icon} ${styles.arrow}`}>➜</span>
        <span className={`${styles.icon} ${styles.check}`}>✔︎</span>
      </span>
      <span className={styles.text}>
        {buttonState === "loading"
          ? loadingText
          : buttonState === "activated"
          ? completedText
          : initialText}
      </span>
    </button>
  );
}
