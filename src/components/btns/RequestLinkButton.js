import styles from "src/styles/elements/btns/requestLinkButton.module.scss";

export default function RequestLinkButton({
  initialText = "Request new link",
  loadingText = "Waiting",
  completedText = "Requested!",
  onClick,
  buttonState,
  textState,
}) {
  return (
    <button
      className={`${styles.newLinkBtn} ${styles[buttonState]} ${styles[textState]}`}
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
