import styles from "../../styles/btns/button.module.scss";
import PropTypes from "prop-types";

export default function Button({
  text,
  variant,
  onClick,
  disabled = false,
  fontSize,
  paddingSize,
  borderSize,
  type = "button",
  Icon,
  iconPosition = "start",
  iconProps = {},
}) {
  const classNames = `${styles.btn} ${styles[variant] || styles.primary}`;

  const buttonStyle = {
    ...(fontSize ? { fontSize } : {}),
    ...(borderSize ? { borderWidth: borderSize } : {}),
    ...(paddingSize ? { padding: paddingSize } : {}),
  };

  // icon size follows the button's font size so it always matches, unless
  // the caller explicitly overrides it via iconProps.
  let iconSize = iconProps.width;
  if (!iconSize && fontSize) {
    const sizeValue = parseFloat(fontSize);
    if (!isNaN(sizeValue)) iconSize = Math.max(7, sizeValue * 0.6);
  }

  const icon = Icon ? (
    <Icon
      className={styles.icon}
      width={iconSize}
      height={iconSize}
      {...iconProps}
    />
  ) : null;

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      {iconPosition === "start" && icon}
      {text}
      {iconPosition === "end" && icon}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "cancel-outlined",
    "cancel",
    "delete",
    "delete-outlined",
    "edit",
    "edit-outlined",
    "light",
    "blue",
    "dark",
    "yellow-outlined",
    "purple-outlined",
    "light-outlined",
  ]).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  Icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(["start", "end"]),
  iconProps: PropTypes.object,
};
