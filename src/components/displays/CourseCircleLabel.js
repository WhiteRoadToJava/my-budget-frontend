import styles from "src/styles/elements/displays/courseCircleLabel.module.scss";

export default function CourseCircleLabel({ status }) {
  const getLabelStyle = () => {
    switch (status) {
      case "published":
        return {
          backgroundColor: "#84DD3C",
          text: "Published",
        };
      case "draft":
        return {
          backgroundColor: "#dabdff",
          text: "Draft",
        };
      case "archived":
        return {
          backgroundColor: "#f87931",
          text: "Archived",
        };
      default:
        return {
          backgroundColor: "#C2C3D0",
        };
    }
  };

  const taskLabel = getLabelStyle();

  return (
    <div className={styles.flex}>
      <div
        className={styles.circleLabel}
        style={{ backgroundColor: taskLabel.backgroundColor }}
      ></div>
      <p>{taskLabel.text}</p>
    </div>
  );
}
