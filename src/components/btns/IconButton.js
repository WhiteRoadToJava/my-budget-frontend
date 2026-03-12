import styles from "src/styles/elements/btns/iconButton.module.scss";
import PropTypes from "prop-types";

export default function IconButton({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  borderSize,
  Icon,
  iconProps = {},
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
      {Icon && (
        <Icon
          className={styles.icon}
          width={iconSize}
          height={iconSize}
          {...iconProps}
        />
      )}
      {text}
    </button>
  );
}

IconButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "cancel", "light"])
    .isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fontSize: PropTypes.string,
  Icon: PropTypes.elementType,
  iconProps: PropTypes.object,
};
