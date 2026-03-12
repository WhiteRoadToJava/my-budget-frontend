import styles from "src/styles/elements/displays/circleLabel.module.scss";

export default function CircleLabel({ label, labelType }) {
  const getLabelStyle = () => {
    if (labelType === "priority") {
      switch (label) {
        case "High":
          return {
            backgroundColor: "#F87931",
            label: "High",
          };
        case "Medium":
          return {
            backgroundColor: "#D6FF41",
            label: "Medium",
          };
        case "Low":
          return {
            backgroundColor: "#DABDFF",
            label: "Low",
          };
        case "OnStandby":
          return {
            backgroundColor: "#C2C3D0",
            label: "On standby",
          };
        case "Completed":
          return {
            backgroundColor: "#84DD3C",
            label: "Completed",
          };
        default:
          return {
            backgroundColor: "#C2C3D0",
            label: "No status",
          };
      }
    } else if (labelType === "status") {
      switch (label) {
        case "Draft":
          return {
            backgroundColor: "#DABDFF",
            label: "Draft",
          };
        case "In progress":
          return {
            backgroundColor: "#D6FF41",
            label: "In progress",
          };
        case "Completed":
          return {
            backgroundColor: "#84DD3C",
            label: "Completed",
          };
        case "Archived":
          return {
            backgroundColor: "#F87931",
            label: "Archived",
          };
        default:
          return {
            backgroundColor: "#C2C3D0",
            label: "No status",
          };
      }
    }
  };

  const taskLabel = getLabelStyle();

  return (
    <div className={styles.flex}>
      <div
        className={styles.circleLabel}
        style={{ backgroundColor: taskLabel.backgroundColor }}
      ></div>
      <p>{taskLabel.label}</p>
    </div>
  );
}
