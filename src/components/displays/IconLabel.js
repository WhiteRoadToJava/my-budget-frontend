import styles from "src/styles/elements/displays/iconLabel.module.scss";

export default function IconLabel({ Icon, label }) {
  return (
    <div className={styles.flex}>
      <Icon />
      <p>{label}</p>
    </div>
  );
}
