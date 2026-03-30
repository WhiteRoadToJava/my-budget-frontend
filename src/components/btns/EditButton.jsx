import styles from "src/styles/elements/btns/editButton.module.scss";
import PropTypes from "prop-types";
import EditIcon from "../icons/btns/EditIcon";

export default function EditButton({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  borderSize,
  backgroundColor,
  fontWeight,
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(backgroundColor === "black" ? { backgroundColor: "black" } : {}),
    ...(fontWeight ? { fontWeight } : {}),
  };

  let iconSize;
  if (fontSize) {
    const sizeValue = parseFloat(fontSize);
    if (!isNaN(sizeValue)) {
      iconSize = Math.max(7, sizeValue * 0.6);
    }
  }

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      <EditIcon
        className={styles.edit}
        style={iconSize}
        width={iconSize}
        height={iconSize}
      />
      {text}
    </button>
  );
}

EditButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "light"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
