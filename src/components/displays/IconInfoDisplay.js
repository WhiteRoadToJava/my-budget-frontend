import styles from "src/styles/elements/displays/iconInfoDisplay.module.scss";

export default function IconInfoDisplay({
  icon,
  info,
  text,
  fontSize,
  fontWeight,
}) {
  const displayStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(fontWeight ? { fontWeight } : {}),
  };

  return (
    <div className={styles.iconInfoDisplay} style={displayStyle}>
      {icon}
      <p className={styles.info}>{info}:</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
